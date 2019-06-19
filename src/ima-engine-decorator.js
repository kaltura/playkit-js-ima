// @flow
import {BaseEngineDecorator, FakeEvent, EventType} from '@playkit-js/playkit-js';
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
    // after error ima doesn't on the same video tag
    if (event.type === EventType.ERROR && this._plugin.isAdFailedOnSameVideoTag()) {
      this._plugin.setAdFailedOnSameVideoTag(false);
      this._plugin.player.getVideoElement().src = this._plugin.getContentSrc();
      this._plugin.player.play();
      return event.defaultPrevented;
    } else if (event.type === EventType.AUTOPLAY_FAILED && this._plugin.isAdFailedOnSameVideoTag()) {
      return event.defaultPrevented;
    }
    if (!this._plugin.isAdOnSameVideoTag()) {
      return super.dispatchEvent(event);
    } else {
      if (this._plugin.isAdPlaying()) {
        return event.defaultPrevented;
      }
      //handle events for fatal adError that doesnt return the video source
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
    return this._plugin.isAdOnSameVideoTag() && this._plugin.isAdPlaying() ? true : super.paused;
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
    return this._plugin.isAdOnSameVideoTag() && this._plugin.isAdPlaying() ? this._plugin.getContentTime() : super.currentTime;
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
    return this._plugin.isAdOnSameVideoTag() && this._plugin.isAdPlaying() ? this._plugin.getContentDuration() : super.duration;
  }
}

export {ImaEngineDecorator};
