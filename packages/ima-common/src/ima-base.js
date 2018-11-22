// @flow
import {BasePlugin, Utils} from '@playkit-js/playkit-js';
import '../assets/style.css';

const ADS_CONTAINER_CLASS: string = 'playkit-ads-container';
const ADS_COVER_CLASS: string = 'playkit-ads-cover';

class ImaBase extends BasePlugin {
  loadPromise: DeferredPromise;
  _sdk: any;
  _adsContainerDiv: HTMLElement;
  _adsCoverDiv: HTMLElement;
  _isAdsCoverActive: boolean;

  static isValid() {
    return true;
  }

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
  }

  _loadImaLib(): Promise<*> {
    return (this._isImaLibLoaded()
      ? Promise.resolve()
      : Utils.Dom.loadScriptAsync(this.config.debug ? this.constructor.DEBUG_LIB_URL : this.constructor.LIB_URL)
    ).then(() => (this._sdk = window.google.ima));
  }

  _initAdsContainer(): void {
    this.logger.debug('Init ads container');
    const playerView = this.player.getView();
    this._adsContainerDiv = Utils.Dom.createElement('div');
    this._adsContainerDiv.id = ADS_CONTAINER_CLASS + playerView.id;
    this._adsContainerDiv.className = ADS_CONTAINER_CLASS;
    this._adsCoverDiv = Utils.Dom.createElement('div');
    this._adsCoverDiv.id = ADS_COVER_CLASS + playerView.id;
    this._adsCoverDiv.className = ADS_COVER_CLASS;
    this._adsCoverDiv.onclick = e => this._onAdsCoverClicked(e);
    Utils.Dom.appendChild(playerView, this._adsContainerDiv);
  }

  _isImaLibLoaded(): boolean {
    return window.google && window.google.ima && window.google.ima.VERSION;
  }

  _showAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.visibility = 'visible';
    }
  }

  _hideAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.visibility = 'hidden';
    }
  }

  _setToggleAdsCover(enable: boolean): void {
    if (enable) {
      this._adsContainerDiv.appendChild(this._adsCoverDiv);
      this._isAdsCoverActive = true;
    } else {
      if (this._isAdsCoverActive) {
        this._adsContainerDiv.removeChild(this._adsCoverDiv);
        this._isAdsCoverActive = false;
      }
    }
  }
}

export {ImaBase};
