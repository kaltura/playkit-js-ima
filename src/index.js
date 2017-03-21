//@flow
import * as Playkit from 'PlayKit.js';


// Define the plugin name
const pluginName = "imaPlugin";

// Define the plugin class
// Important: plugin must derived from BasePlugin
class imaPlugin extends Playkit.BasePlugin  /*implements IPlayerDecoratorProvider*/ {

  // You can override and define your default configuration for the plugin
  static defaultConfig: Object = {
    debug: false ,
    timeout: 5000 ,
    prerollTimeout: 100 ,
    adLabel: 'Advertisement' ,
    showControlsForJSAds: true
  };

  adContainerDiv: HTMLDivElement;
  adDisplayContainer: any;
  adDisplayContainerInitialized: boolean = false;
  adsLoader: any;
  adsManager: any;
  adsRenderingSettings: any;
  playOnceReady: boolean = false;
  adsActive: boolean = false;
  initComplete:boolean = false;
  contentPlayheadTracker: Object = {
    currentTime: 0 ,
    previousTime: 0 ,
    seeking: false ,
    duration: 0
  };

  // Your plugin must implement isValid method
  static isValid() {
    return true;
  }

  /**
   * Your plugin constructor gets out of the box 3 params:
   * @param name Plugin name
   * @param player Player reference
   * @param config Plugin config
   */
  constructor( name: string , player: Playkit.Player , config: Object ) {
    // Step 1: call the super with the constructor params
    super( name , player , config );

    this.logger.info( "in constructor" );


    // Step 2: do any necessary setup actions
    this._configure();
    this._setup();
    this._addBindings();
  }

  getPlayerDecorator(): Playkit.PlayerDecoratorBase {
    let adsManager = this;
    class myDecorator extends Playkit.PlayerDecoratorBase {
      prepare() {
        adsManager._requestAds();
      }

      play() {
        if ( !adsManager.initComplete ) {
          adsManager._initialUserAction();
        } else {
          if (adsManager.adsActive){
            adsManager.adsManager.resume();
          } else {
            super.play();
          }
        }
      }

      skipAd() {
        if ( adsManager.adsManager && adsManager.adsManager.getAdSkippableState() ) {
          debugger;
          adsManager.adsManager.skip();
        }
      }

      pause(){
        if (adsManager.adsActive){
          adsManager.adsManager.pause();
        } else {
          super.pause();
        }

      }
    }
    return new myDecorator();
  }

  _initialUserAction(): void {
    this.adDisplayContainer.initialize();
    if ( this.adsManager ) {
      this.adsManager.start();
      this.player.prepare();
    } else {
      this.playOnceReady = true;
    }
    this.initComplete = true;
  }

  _configure(): void {
    this.eventManager.listen( this.player , "EngineAdded" , this._initIMA.bind( this ) );

  }

  _updateCurrentTime(): void {
    if ( !this.contentPlayheadTracker.seeking ) {
      this.contentPlayheadTracker.currentTime = this.player.currentTime();
    }
  }

  _initIMA(): void {
    this.adContainerDiv =
      this.player.getVideoElement().parentNode.appendChild(
        document.createElement( 'div' ) );
    this.adContainerDiv.style.position = "absolute";
    this.adContainerDiv.style.zIndex = 2000;
    this.adContainerDiv.style.top = 0;
    this.adDisplayContainer =
      new window.google.ima.AdDisplayContainer( this.adContainerDiv , this.player.getVideoElement() );
    this.adsLoader = new window.google.ima.AdsLoader( this.adDisplayContainer );
    this.adsManager = null;

    this.adsLoader.addEventListener(
      window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED ,
      this.onAdsManagerLoaded_ ,
      false ,
      this );
    this.adsLoader.addEventListener(
      window.google.ima.AdErrorEvent.Type.AD_ERROR ,
      this.onAdError_ ,
      false ,
      this );

  }

  showAdsContainer(): void {
    this.adContainerDiv.style.display = "";
  }

  hideAdsContainer(): void {
    this.adContainerDiv.style.display = "none";
  }

  onAdsManagerLoaded_( adsManagerLoadedEvent: any ): void {
    this.logger.info( 'Ads loaded.' );
    var adsRenderingSettings = new window.google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    this.adsManager = adsManagerLoadedEvent.getAdsManager(
      this.contentPlayheadTracker , adsRenderingSettings );
    this.processAdsManager( this.adsManager );
  }

  processAdsManager( adsManager: any ): void {
    // Attach the pause/resume events.
    adsManager.addEventListener(
      window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED ,
      this.onContentPauseRequested ,
      false ,
      this );
    adsManager.addEventListener(
      window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED ,
      this.onContentResumeRequested ,
      false ,
      this );
    // Handle errors.
    adsManager.addEventListener(
      window.google.ima.AdErrorEvent.Type.AD_ERROR ,
      this.onAdError ,
      false ,
      this );
    let events = [window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED ,
      window.google.ima.AdEvent.Type.CLICK ,
      window.google.ima.AdEvent.Type.COMPLETE ,
      window.google.ima.AdEvent.Type.FIRST_QUARTILE ,
      window.google.ima.AdEvent.Type.LOADED ,
      window.google.ima.AdEvent.Type.MIDPOINT ,
      window.google.ima.AdEvent.Type.PAUSED ,
      window.google.ima.AdEvent.Type.STARTED ,
      window.google.ima.AdEvent.Type.THIRD_QUARTILE];
    for ( let index of events ) {
      adsManager.addEventListener(
        index ,
        this.onAdEvent,
        false ,
        this );
    }

    let initWidth = parseInt(getComputedStyle(this.player.getVideoElement()).width,10);
    let initHeight = parseInt(getComputedStyle(this.player.getVideoElement()).height,10);
    // if ( this.application_.fullscreen ) {
    //   initWidth = this.application_.fullscreenWidth;
    //   initHeight = this.application_.fullscreenHeight;
    // } else {
    //   initWidth = this.videoPlayer_.width;
    //   initHeight = this.videoPlayer_.height;
    //}
    adsManager.init(
      initWidth ,
      initHeight ,
      window.google.ima.ViewMode.NORMAL );

    if (this.playOnceReady){
      adsManager.start();
    }
  }

  //Ads events:
  onAdError(adEvent: any){
    this.logger.info("onAdError:" + adEvent);
  }
  onContentPauseRequested(adEvent: any){
    this.logger.info("onContentPauseRequested:" + adEvent);
    this.showAdsContainer();
    this.adsActive = true;
  }
  onContentResumeRequested(adEvent: any){
    this.logger.info("onContentResumeRequested:" + adEvent);
    this.hideAdsContainer();
    this.player.play();
    this.adsActive = false;
  }
  onAdEvent(adEvent: any){
    this.logger.info("onAdEvent:" + adEvent.type);
  }

  _requestAds(): void{
    this.logger.info("requestAds");
    // if (!this.adDisplayContainerInitialized) {
    //   this.adDisplayContainer.initialize();
    // }
    let adsRequest = new window.google.ima.AdsRequest();
    let adTagUrl = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=";

    if (adTagUrl /*this.settings.adTagUrl*/) {
      adsRequest.adTagUrl = adTagUrl;
    } else {
      adsRequest.adsResponse = this.settings.adsResponse;
    }
    // if (this.settings.forceNonLinearFullSlot) {
    //   adsRequest.forceNonLinearFullSlot = true;
    // }

    // adsRequest.linearAdSlotWidth = this.getPlayerWidth();
    // adsRequest.linearAdSlotHeight = this.getPlayerHeight();
    // adsRequest.nonLinearAdSlotWidth =
    //   this.settings.nonLinearWidth || this.getPlayerWidth();
    // adsRequest.nonLinearAdSlotHeight =
    //   this.settings.nonLinearHeight || (this.getPlayerHeight() / 3);

    this.adsLoader.requestAds(adsRequest);
  }

  _setup(): void {

  }

  _addBindings(): void {
    // Register to the play event
    this.eventManager.listen(this.player, "timeupdate", this._updateCurrentTime.bind(this));
    this.logger.info("in _addBindings");
  }



  // Your plugin must implement destroy method
  destroy(): void {
    this.logger.info("in destroy", this._numbers, this._firstCellValue, this._lastCellValue, this._size);
  }
}

// Register the plugin in Playkit system
Playkit.registerPlugin(pluginName, imaPlugin);

window.Playkit = Playkit;

