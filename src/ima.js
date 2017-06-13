//@flow
import {registerPlugin, BasePlugin, PlayerDecoratorBase} from 'playkit-js'
import ImaDecorator from './ima-decorator'

const pluginName = "ima";

class ImaPlugin extends BasePlugin {

  static defaultConfig: Object = {
    debug: false,
    timeout: 5000,
    prerollTimeout: 100,
    adLabel: 'Advertisement',
    showControlsForJSAds: true
  };

  static IMA_SDK_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3_debug.js";

  sdk: any;
  imaPromise: Promise<*>;
  mediaLoaded: boolean;
  canPlayMedia: boolean;
  playerLoaded: boolean;
  initComplete: boolean;
  adsActive: boolean;
  adsManager: any;
  _adContainerDiv: HTMLDivElement;
  _adDisplayContainer: any;
  _adsLoader: any;
  _playOnceReady: boolean;
  _allAdsCompleted: boolean;
  _contentPlayheadTracker: Object;

  static isValid() {
    return true;
  }

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this.imaPromise = this._loadScriptAsync(ImaPlugin.IMA_SDK_LIB_URL);
    this.mediaLoaded = false;
    this.canPlayMedia = false;
    this.playerLoaded = false;
    this.initComplete = false;
    this.adsActive = false;
    this._playOnceReady = false;
    this._contentPlayheadTracker = {
      currentTime: 0,
      previousTime: 0,
      seeking: false,
      duration: 0
    };
    this._addBindings();
  }

  _addBindings(): void {
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._updateCurrentTime.bind(this));
    this.eventManager.listen(this.player, this.player.Event.ENDED, this._mediaEnded.bind(this));
  }

  _updateCurrentTime(): void {
    if (!this._contentPlayheadTracker.seeking) {
      this._contentPlayheadTracker.currentTime = this.player.currentTime;
    }
  }

  _showAdsContainer(): void {
    this._adContainerDiv.style.display = "";
  }

  _hideAdsContainer(): void {
    this._adContainerDiv.style.display = "none";
  }

  _onAdError(params): void {
    this.logger.error("Error occur while loading the adsLoader: " + params);
  }

  _onAdsManagerLoaded(adsManagerLoadedEvent: any): void {
    this.logger.debug('Ads loaded');
    let adsRenderingSettings = new this.sdk.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    this.adsManager = adsManagerLoadedEvent.getAdsManager(this._contentPlayheadTracker, adsRenderingSettings);
    this._processAdsManager();
  }

  _processAdsManager(): void {
    // Attach the pause/resume events
    this.adsManager.addEventListener(this.sdk.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this._onContentPauseRequested.bind(this));
    this.adsManager.addEventListener(this.sdk.AdEvent.Type.CONTENT_RESUME_REQUESTED, this._onContentResumeRequested.bind(this));
    // Handle errors
    this.adsManager.addEventListener(this.sdk.AdErrorEvent.Type.AD_ERROR, this._onAdError.bind(this));
    let events = [
      this.sdk.AdEvent.Type.ALL_ADS_COMPLETED,
      this.sdk.AdEvent.Type.CLICK,
      this.sdk.AdEvent.Type.COMPLETE,
      this.sdk.AdEvent.Type.FIRST_QUARTILE,
      this.sdk.AdEvent.Type.LOADED,
      this.sdk.AdEvent.Type.MIDPOINT,
      this.sdk.AdEvent.Type.PAUSED,
      this.sdk.AdEvent.Type.STARTED,
      this.sdk.AdEvent.Type.THIRD_QUARTILE
    ];
    for (let index of events) {
      this.adsManager.addEventListener(index, this._onAdEvent.bind(this));
    }
    let initWidth = parseInt(getComputedStyle(this.player.getVideoElement()).width, 10);
    let initHeight = parseInt(getComputedStyle(this.player.getVideoElement()).height, 10);
    // TODO: Handle full screen
    this.adsManager.init(initWidth, initHeight, this.sdk.ViewMode.NORMAL);
    if (this._playOnceReady) {
      this.adsManager.start();
    }
  }

  _onContentPauseRequested(adEvent: any) {
    this.logger.debug("onContentPauseRequested", adEvent);
    this._showAdsContainer();
    this.adsActive = true;
  }

  _onContentResumeRequested(adEvent: any) {
    this.logger.debug("onContentResumeRequested", adEvent);
    if (!this.contentComplete) {
      this._hideAdsContainer();
      this.player.play();
      this.adsActive = false;
    }
  }

  _onAllAdsComplete(adEvent: any) {
    this.logger.debug("onAllAdsComplete", adEvent);
    this._hideAdsContainer();
    this._allAdsCompleted = true;
  }

  _onAdEvent(adEvent: any) {
    this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
    switch (adEvent.type) {
      case this.sdk.AdEvent.Type.ALL_ADS_COMPLETED:
        this._onAllAdsComplete(adEvent);
        break;
    }
  }

  _mediaEnded(): void {
    if (this._adsLoader && !this.contentComplete) {
      this._adsLoader.contentComplete();
      this.contentComplete = true;
    }
  }

  _resetIma(): void {
    this.adsActive = false;
    this._hideAdsContainer();
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
    if (this._adsLoader && !this.contentComplete) {
      this._adsLoader.contentComplete();
    }
    this.contentComplete = false;
    this._allAdsCompleted = false;
    this._playOnceReady = false;
    this.canPlayMedia = false;
  }

  _loadScriptAsync(url: string): Promise<*> {
    if (Array.isArray(url)) {
      let self = this, prom = [];
      url.forEach(function (item) {
        prom.push(self.script(item));
      });
      return Promise.all(prom);
    }
    return new Promise(function (resolve, reject) {
      let r = false,
        t = document.getElementsByTagName("script")[0],
        s = document.createElement("script");
      s.type = "text/javascript";
      s.src = url;
      s.async = true;
      s.onload = s.onreadystatechange = function () {
        if (!r && (!this.readyState || this.readyState == "complete")) {
          r = true;
          resolve(this);
        }
      };
      s.onerror = s.onabort = reject;
      if (t && t.parentNode) {
        t.parentNode.insertBefore(s, t);
      }
    });
  }

  initIma(): void {
    if (!document.getElementById("adContainer")) {
      this.adsManager = null;
      this._adContainerDiv = this.player.getVideoElement().parentNode.appendChild(document.createElement('div'));
      this._adContainerDiv.id = "adContainer";
      this._adContainerDiv.style.position = "absolute";
      this._adContainerDiv.style.zIndex = 2000;
      this._adContainerDiv.style.top = 0;
      this._adDisplayContainer = new this.sdk.AdDisplayContainer(this._adContainerDiv, this.player.getVideoElement());
      this._adsLoader = new this.sdk.AdsLoader(this._adDisplayContainer);
      this._adsLoader.addEventListener(this.sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this));
      this._adsLoader.addEventListener(this.sdk.AdErrorEvent.Type.AD_ERROR, this._onAdError.bind(this));
    }
  }

  playAdNow(tag: string): void {
    this._resetIma();
    this.config.adTagURL = tag;
    if (!this.playerLoaded) {
      this.initIma();
      this.playerLoaded = true;
    }
    this.requestAds();
    this.initialUserAction();
    this.adsManager.start();
  }

  getPlayerDecorator(): PlayerDecoratorBase {
    return new ImaDecorator(this);
  }

  initialUserAction(): void {
    this._adDisplayContainer.initialize();
    if (this.adsManager) {
      this.adsManager.start();
      if (!this.mediaLoaded) {
        this.player.load().then(() => {
          this.mediaLoaded = true;
        });
      }
    } else {
      this._playOnceReady = true;
    }
    this.initComplete = true;
  }

  requestAds(): boolean {
    this.logger.debug("requestAds");
    this._resetIma();
    let adsRequest = new this.sdk.AdsRequest();
    if (this.config.adTagURL) {
      adsRequest.adTagUrl = this.config.adTagURL;
    } else {
      adsRequest.adsResponse = this.config.adsResponse;
    }
    if (!adsRequest.adTagUrl && !adsRequest.adsResponse) {
      this.logger.error("missing config for ima plugin");
      return false;
    }
    //TODO: Handle non-linear
    this._adsLoader.requestAds(adsRequest);
    return true;
  }

  destroy(): void {
    this.logger.debug("destroy");
    this.eventManager.destroy();
    this._resetIma();
  }
}

registerPlugin(pluginName, ImaPlugin);
