// @flow
import {BaseEngineDecorator, FakeEvent, Error} from '@playkit-js/playkit-js';
import {Ima} from './ima';

/**
 * Engine decorator for ima dai plugin.
 * @class ImaDAIEngineDecorator
 * @param {IEngine} engine - The HTML5 engine.
 * @param {Ima} plugin - The ima dai plugin.
 */
class ImaEngineDecorator extends BaseEngineDecorator {
  _src: String;
  _plugin: Ima;

  constructor(engine: IEngine, plugin: Ima) {
    super(engine);
    this._plugin = plugin;
  }

  dispatchEvent(event: FakeEvent): ?boolean {
    if (this._plugin.isAdsPlayingCustomPlayback() && !!event.payload && event.payload.code === Error.Code.VIDEO_ERROR) {
      this._src = this._engine.getVideoElement().src;
      setTimeout(() => {
        if (this._src === this._engine.getVideoElement().src) {
          super.dispatchEvent(event);
        }
      }, 0);
      return event.defaultPrevented;
    } else {
      return super.dispatchEvent(event);
    }
  }
}

export {ImaEngineDecorator};
