import {registerPlugin, BasePlugin, PlayerDecoratorBase} from 'playkit-js'

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

  imaLib;
  imaPromise;

  adContainerDiv: HTMLDivElement;
  adDisplayContainer: any;
  adsLoader: any;
  adsManager: any;
  mediaLoaded: boolean = false;
  target: HTMLDivElement;
  playerLoaded: boolean = false;
  playOnceReady: boolean = false;
  adsActive: boolean = false;
  canPlayMedia: boolean = false;
  initComplete: boolean = false;
  allAdsCompleted: boolean;
  contentPlayheadTracker: Object = {
    currentTime: 0,
    previousTime: 0,
    seeking: false,
    duration: 0
  };

  static isValid() {
    return true;
  }

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this.target = this.player.getVideoElement();
    this.imaPromise = script(ImaPlugin.IMA_SDK_LIB_URL);
    this._addBindings();
  }

  getPlayerDecorator(): PlayerDecoratorBase {
    let plugin = this;

    class ImaDecorator extends PlayerDecoratorBase {
      load() {
        return plugin.imaPromise.then(() => {
          plugin.imaLib = window.google.ima;
          plugin._initIMA();
          if (!plugin._requestAds()) {
            return super.load().then(() => {
              plugin.mediaLoaded = true;
              plugin.canPlayMedia = true;
            });
          }
          plugin.playerLoaded = true;
        });
      }

      play() {
        if (!plugin.playerLoaded) {
          this.load();
          // If we don't have any ads - play the content
          if (plugin.canPlayMedia) {
            super.play();
          }
        }
        if (!plugin.initComplete) {
          plugin._initialUserAction();
        } else {
          if (plugin.adsActive) {
            plugin.adsManager.resume();
          } else {
            super.play();
          }
        }
      }

      skipAd() {
        if (plugin.adsManager && plugin.adsManager.getAdSkippableState()) {
          plugin.adsManager.skip();
        }
      }

      playAdNow(adTagURL: String) {
        this.pause();
        plugin.playAdNow(adTagURL);
      }

      pause() {
        if (plugin.adsActive) {
          plugin.adsManager.pause();
        } else {
          super.pause();
        }
      }
    }

    return new ImaDecorator();
  }

  _initialUserAction(): void {
    this.adDisplayContainer.initialize();
    if (this.adsManager) {
      this.adsManager.start();
      if (!this.mediaLoaded) {
        this.player.load().then(() => {
          this.mediaLoaded = true;
        });
      }
    } else {
      this.playOnceReady = true;
    }
    this.initComplete = true;
  }

  _updateCurrentTime(): void {
    if (!this.contentPlayheadTracker.seeking) {
      this.contentPlayheadTracker.currentTime = this.player.currentTime;
    }
  }

  _initIMA(): void {
    if (!document.getElementById("adContainer")) {
      this.adContainerDiv = this.target.parentNode.appendChild(document.createElement('div'));
      this.adContainerDiv.id = "adContainer";
      this.adContainerDiv.style.position = "absolute";
      this.adContainerDiv.style.zIndex = 2000;
      this.adContainerDiv.style.top = 0;
      this.adDisplayContainer = new this.imaLib.AdDisplayContainer(this.adContainerDiv, this.player.getVideoElement());
      this.adsLoader = new this.imaLib.AdsLoader(this.adDisplayContainer);
      this.adsManager = null;
      this.adsLoader.addEventListener(this.imaLib.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded, false, this);
      this.adsLoader.addEventListener(this.imaLib.AdErrorEvent.Type.AD_ERROR, this._onAdError, false, this);
    }
  }

  playAdNow(tag: String): void {
    this._resetIma();
    this.config.adTagURL = tag;
    if (!this.playerLoaded) {
      this._initIMA();
      this.playerLoaded = true;
    }
    this._requestAds();
    this._initialUserAction();
    this.adsManager.start();
  }

  showAdsContainer(): void {
    this.adContainerDiv.style.display = "";
  }

  hideAdsContainer(): void {
    this.adContainerDiv.style.display = "none";
  }

  _onAdError(params): void {
    this.logger.error("Error occur while loading the adsLoader::" + params);
  }

  _onAdsManagerLoaded(adsManagerLoadedEvent: any): void {
    this.logger.info('Ads loaded.');
    let adsRenderingSettings = new this.imaLib.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    this.adsManager = adsManagerLoadedEvent.getAdsManager(this.contentPlayheadTracker, adsRenderingSettings);
    this._processAdsManager(this.adsManager);
  }

  _processAdsManager(adsManager: any): void {
    debugger;
    // Attach the pause/resume events
    adsManager.addEventListener(this.imaLib.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this._onContentPauseRequested, false, this);
    adsManager.addEventListener(this.imaLib.AdEvent.Type.CONTENT_RESUME_REQUESTED, this._onContentResumeRequested, false, this);
    // Handle errors
    adsManager.addEventListener(this.imaLib.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
    let events = [
      this.imaLib.AdEvent.Type.ALL_ADS_COMPLETED,
      this.imaLib.AdEvent.Type.CLICK,
      this.imaLib.AdEvent.Type.COMPLETE,
      this.imaLib.AdEvent.Type.FIRST_QUARTILE,
      this.imaLib.AdEvent.Type.LOADED,
      this.imaLib.AdEvent.Type.MIDPOINT,
      this.imaLib.AdEvent.Type.PAUSED,
      this.imaLib.AdEvent.Type.STARTED,
      this.imaLib.AdEvent.Type.THIRD_QUARTILE
    ];

    for (let index of events) {
      adsManager.addEventListener(index, this._onAdEvent, false, this);
    }

    let initWidth = parseInt(getComputedStyle(this.target).width, 10);
    let initHeight = parseInt(getComputedStyle(this.target).height, 10);

    // TODO: Handle full screen

    adsManager.init(initWidth, initHeight, this.imaLib.ViewMode.NORMAL);

    if (this.playOnceReady) {
      adsManager.start();
    }
  }

  //Ads events:
  onAdError(adEvent: any) {
    this.logger.info("onAdError:" + adEvent);
  }

  _onContentPauseRequested(adEvent: any) {
    this.logger.info("_onContentPauseRequested:" + adEvent);
    this.showAdsContainer();
    this.adsActive = true;
  }

  _onContentResumeRequested(adEvent: any) {
    debugger;
    this.logger.info("_onContentResumeRequested:" + adEvent);
    if (!this.contentComplete) {
      this.hideAdsContainer();
      this.player.play();
      this.adsActive = false;
    }
  }

  allAdsComplete(adEvent: any) {
    this.hideAdsContainer();
    this.allAdsCompleted = true;
  }

  _onAdEvent(adEvent: any) {
    this.logger.info("_onAdEvent:" + adEvent.type);
    switch (adEvent.type) {
      case window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
        this.allAdsComplete(adEvent);
        break;
    }
  }

  _requestAds(): boolean {
    this.logger.debug("requestAds");
    this._resetIma();
    let adsRequest = new this.imaLib.AdsRequest();
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
    this.adsLoader.requestAds(adsRequest);
    return true;
  }

  _addBindings(): void {
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._updateCurrentTime.bind(this));
    this.eventManager.listen(this.player, this.player.Event.ENDED, this._mediaEnded.bind(this));
  }

  _mediaEnded(): void {
    if (this.adsLoader && !this.contentComplete) {
      this.adsLoader.contentComplete();
      this.contentComplete = true;
    }
  }

  _resetIma(): void {
    this.adsActive = false;
    this.hideAdsContainer();
    if (this.adsManager) {
      this.adsManager.destroy();
      this.adsManager = null;
    }
    if (this.adsLoader && !this.contentComplete) {
      this.adsLoader.contentComplete();
    }
    this.contentComplete = false;
    this.allAdsCompleted = false;
    this.playOnceReady = false;
    this.canPlayMedia = false;
  }

  destroy(): void {
    this.logger.info("in destroy");
    this.eventManager.removeAll();
    this._resetIma();
  }
}

registerPlugin(pluginName, ImaPlugin);

function script(url) {
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
    t.parentNode.insertBefore(s, t);
  });
}
