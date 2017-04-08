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
  adsLoader: any;
  adsManager: any;
  mediaLoaded:boolean = false;
  target:HTMLDivElement;
  playerLoaded:boolean = false;
  playOnceReady: boolean = false;
  adsActive: boolean = false;
  canPlayMedia:boolean = false;
  initComplete:boolean = false;
  allAdsCompleted:boolean
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
    super( name , player , config );
    this.target = window.document.getElementById(player._config.target);
    this.config = config;
    this.logger.info( "in constructor" );
    this._setup();
    this._addBindings();
  }

  getPlayerDecorator(): Playkit.PlayerDecoratorBase {
    let adsManager = this;
    class myDecorator extends Playkit.PlayerDecoratorBase {
      load() {
        adsManager._initIMA();
        if ( !adsManager._requestAds() ) {
          super.load();
          adsManager.mediaLoaded = true;
          adsManager.canPlayMedia = true;
        }
        adsManager.playerLoaded = true;
      }

      play() {
        if ( !adsManager.playerLoaded ){
          this.load();

          //if we dont have any ads - play the content
          if (adsManager.canPlayMedia){
            super.play();
          }
        }
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

      playAdNow(adTagURL: String){
          this.pause();
          adsManager.playAdNow(adTagURL);
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
      if ( !this.mediaLoaded ) {
        this.player.load();
        this.mediaLoaded = true;
      }
    } else {
      this.playOnceReady = true;
    }
    this.initComplete = true;
  }

  _updateCurrentTime(): void {
    if ( !this.contentPlayheadTracker.seeking ) {
      this.contentPlayheadTracker.currentTime = this.player.currentTime();
    }
  }

  _initIMA(): void {
    if ( !document.getElementById("adContainer") ) {
      this.adContainerDiv = this.target.appendChild(
        document.createElement( 'div' ) );
      this.adContainerDiv.id = "adContainer";
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

  }

  playAdNow(tag: String): void{
    this.resetIMA();
    this.config.adTagURL = tag;
    if ( !this.playerLoaded ) {
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

  onAdError_(params):void{
    this.logger.error("Error occur while loading the adsLoader::"+params);
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

    let initWidth = parseInt(getComputedStyle(this.target).width,10);
    let initHeight = parseInt(getComputedStyle(this.target).height,10);
  // TODO: handle full screen
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
    if ( !this.contentComplete ) {
      this.hideAdsContainer();
      this.player.play();
      this.adsActive = false;
    }
  }

  allAdsComplete(adEvent: any){
    this.hideAdsContainer();
    this.allAdsCompleted = true;
  }
  onAdEvent(adEvent: any){
    this.logger.info("onAdEvent:" + adEvent.type);
    switch (adEvent.type){
      case window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED: this.allAdsComplete(adEvent);
      break;

    }


  }

  _requestAds(): boolean{
    this.logger.info("requestAds");
    this.resetIMA();
    let adsRequest = new window.google.ima.AdsRequest();
    if ( this.config.adTagURL ) {
      adsRequest.adTagUrl = this.config.adTagURL;
    } else {
      adsRequest.adsResponse = this.config.adsResponse;
    }

    if ( !adsRequest.adTagUrl && !adsRequest.adsResponse) {
      this.logger.error("missing config for ima plugin");
      return false;
    }
    //TODO:handle non-linear
    this.adsLoader.requestAds(adsRequest);
    return true;
  }

  _setup(): void {

  }

  _addBindings(): void {
    // Register to the play event
    this.eventManager.listen(this.player, "timeupdate", this._updateCurrentTime.bind(this));
    this.eventManager.listen(this.player, "ended", this._mediaEnded.bind(this));
    this.logger.info("in _addBindings");
  }

  _mediaEnded():void{
    if (this.adsLoader && !this.contentComplete) {
      this.adsLoader.contentComplete();
      this.contentComplete = true;
    }
  }
  resetIMA():void {
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


  // Your plugin must implement destroy method
  destroy(): void {
    this.logger.info("in destroy");
    this.eventManager.removeAll();
    this.resetIMA();
  }
}

// Register the plugin in Playkit system
Playkit.registerPlugin(pluginName, imaPlugin);

window.Playkit = Playkit;

