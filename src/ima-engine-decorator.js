// @flow
import {FakeEvent} from '@playkit-js/playkit-js';
import {Ima} from './ima';

/**
 * Engine decorator for ima plugin.
 * @class ImaEngineDecorator
 * @param {IEngine} engine - The HTML5 engine.
 * @param {Ima} plugin - The ima plugin.
 */
class ImaEngineDecorator {
  _plugin: Ima;

  constructor(engine: IEngine, plugin: Ima) {
    this._plugin = plugin;
  }

  get active(): boolean {
    return this._plugin.isAdOnSameVideoTag() && this._plugin.isAdPlaying();
  }

  dispatchEvent(event: FakeEvent): boolean {
    return event.defaultPrevented;
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
  get currentTime(): number {
    return this._plugin.getContentTime();
  }
  /**
   * Set the current time in seconds.
   * @param {number} to - The number to set in seconds.
   * @public
   * @returns {void}
   */
  set currentTime(to: number): void {
    // Do nothing
  }
  /**
   * Get the duration in seconds.
   * @returns {number} - The playback duration.
   * @public
   * @override
   * @instance
   * @memberof ImaEngineDecorator
   */
  get duration(): number {
    return this._plugin.getContentDuration();
  }
}

export {ImaEngineDecorator};
