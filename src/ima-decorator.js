//@flow
import {PlayerDecoratorBase} from 'playkit-js'

export default class ImaDecorator extends PlayerDecoratorBase {

  _plugin: any;

  constructor(imaPlugin: any) {
    super();
    this._plugin = imaPlugin;
  }

  load(): Promise<Object> {
    return this._plugin.imaPromise.then(() => {
      this._plugin.sdk = window.google.ima;
      this._plugin.initIma();
      if (!this._plugin.requestAds()) {
        return super.load().then(() => {
          this._plugin.mediaLoaded = true;
          this._plugin.canPlayMedia = true;
        });
      }
      this._plugin.playerLoaded = true;
    });
  }

  play(): void {
    let promise = new Promise((resolve /*, reject */) => {
      if (!this._plugin.playerLoaded) {
        this.load().then(() => {
          // If we don't have any ads - play the content
          if (this._plugin.canPlayMedia) {
            super.play();
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
    promise.then(() => {
      if (!this._plugin.initComplete) {
        this._plugin.initialUserAction();
      } else {
        if (this._plugin.adsActive) {
          this._plugin.adsManager.resume();
        } else {
          super.play();
        }
      }
    });
  }

  skipAd(): void {
    if (this._plugin.adsManager && this._plugin.adsManager.getAdSkippableState()) {
      this._plugin.adsManager.skip();
    }
  }

  playAdNow(adTagUrl: string): void {
    this.pause();
    this._plugin.playAdNow(adTagUrl);
  }

  pause(): void {
    if (this._plugin.adsActive) {
      this._plugin.adsManager.pause();
    } else {
      super.pause();
    }
  }
}
