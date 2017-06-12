//@flow
import {PlayerDecoratorBase} from 'playkit-js'

export default class ImaDecorator extends PlayerDecoratorBase {

  _imaPlugin: any;

  constructor(imaPlugin: any) {
    super();
    this._imaPlugin = imaPlugin;
  }

  load(): Promise<Object> {
    return this._imaPlugin.imaPromise.then(() => {
      this._imaPlugin.imaLib = window.google.ima;
      this._imaPlugin.initIma();
      if (!this._imaPlugin.requestAds()) {
        return super.load().then(() => {
          this._imaPlugin.mediaLoaded = true;
          this._imaPlugin.canPlayMedia = true;
        });
      }
      this._imaPlugin.playerLoaded = true;
    });
  }

  play(): void {
    if (!this._imaPlugin.playerLoaded) {
      this.load();
      // If we don't have any ads - play the content
      if (this._imaPlugin.canPlayMedia) {
        super.play();
      }
    }
    if (!this._imaPlugin.initComplete) {
      this._imaPlugin.initialUserAction();
    } else {
      if (this._imaPlugin.adsActive) {
        this._imaPlugin.adsManager.resume();
      } else {
        super.play();
      }
    }
  }

  skipAd(): void {
    if (this._imaPlugin.adsManager && this._imaPlugin.adsManager.getAdSkippableState()) {
      this._imaPlugin.adsManager.skip();
    }
  }

  playAdNow(adTagURL: String): void {
    this.pause();
    this._imaPlugin.playAdNow(adTagURL);
  }

  pause(): void {
    if (this._imaPlugin.adsActive) {
      this._imaPlugin.adsManager.pause();
    } else {
      super.pause();
    }
  }
}
