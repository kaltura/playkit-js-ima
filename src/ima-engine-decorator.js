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
    //handle events for fatal adError that doesnt return the video source
    if (this._plugin.isAdsFailedAndSourceChanged() && event.type === EventType.ERROR) {
      this._plugin.setAdsFailed(false);
      this._plugin.player.getVideoElement().src = this._plugin.getContentSrc();
      this._plugin.player.play();
      return event.defaultPrevented;
    } else if (this._plugin.isAdsFailedAndSourceChanged() && event.type === EventType.AUTOPLAY_FAILED) {
      return event.defaultPrevented;
    } else {
      return this._plugin.isAdsPlayingOnSameVideoTag() ? event.defaultPrevented : super.dispatchEvent(event);
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
    return this._plugin.isAdsPlayingOnSameVideoTag() ? true : super.paused;
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
    return this._plugin.isAdsPlayingOnSameVideoTag() ? this._plugin.getContentTime() : super.currentTime;
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
    return this._plugin.isAdsPlayingOnSameVideoTag() ? this._plugin.getContentDuration() : super.duration;
  }
}

export {ImaEngineDecorator};
