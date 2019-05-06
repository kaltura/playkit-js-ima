// @flow
import {BaseEngineDecorator, FakeEvent, Error} from '@playkit-js/playkit-js';

/**
 * Engine decorator for ima dai plugin.
 * @class ImaDAIEngineDecorator
 * @param {IEngine} engine - The HTML5 engine.
 * @param {Ima} plugin - The ima dai plugin.
 */
class ImaEngineDecorator extends BaseEngineDecorator {
  _src: String;

  constructor(engine: IEngine) {
    super(engine);
  }

  dispatchEvent(event: FakeEvent): ?boolean {
    if (!!event.payload && event.payload.code === Error.Code.VIDEO_ERROR) {
      this._src = this._engine.getVideoElement().src;
      setTimeout(() => {
        if (this._src === this._engine.getVideoElement().src) {
          return super.dispatchEvent(event);
        }
      }, 0);
    } else {
      return super.dispatchEvent(event);
    }
  }
}

export {ImaEngineDecorator};
