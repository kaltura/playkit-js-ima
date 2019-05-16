// @flow
import {BaseEngineDecorator, FakeEvent} from '@playkit-js/playkit-js';
import {Ima} from './ima';

/**
 * Engine decorator for ima plugin.
 * @class ImaEngineDecorator
 * @param {IEngine} engine - The HTML5 engine.
 * @param {Ima} plugin - The ima plugin.
 */
class ImaEngineDecorator extends BaseEngineDecorator {
  _plugin: Ima;

  constructor(engine: IEngine, plugin: Ima) {
    super(engine);
    this._plugin = plugin;
  }

  dispatchEvent(event: FakeEvent): boolean {
    if (this._plugin.isAdsPlayingCustomPlayback()) {
      return event.defaultPrevented;
    } else {
      return super.dispatchEvent(event);
    }
  }
  /**
   * Get paused state.
   * @returns {boolean} - The paused value of the engine.
   * @public
   * @override
   * @instance
   * @memberof ImaEngineDecorator
   */
  get paused(): boolean {
    if (!this._plugin.isAdsPlayingCustomPlayback()) {
      return super.paused;
    }
    return true;
  }
  /**
   * Get the current time in seconds.
   * @returns {number} - The current playback time.
   * @public
   * @override
   * @instance
   * @memberof ImaEngineDecorator
   */
  get currentTime(): ?number {
    if (!this._plugin.isAdsPlayingCustomPlayback()) {
      return super.currentTime;
    }
    return this._plugin.getContentTime();
  }
  /**
   * Set the current time in seconds.
   * @param {number} to - The number to set in seconds.
   * @public
   * @returns {void}
   */
  set currentTime(to: number): void {
    super.currentTime = to;
  }
  /**
   * Get the duration in seconds.
   * @returns {number} - The playback duration.
   * @public
   * @override
   * @instance
   * @memberof ImaEngineDecorator
   */
  get duration(): ?number {
    if (!this._plugin.isAdsPlayingCustomPlayback()) {
      return super.duration;
    }
    return this._plugin.getContentDuration();
  }
}

export {ImaEngineDecorator};
