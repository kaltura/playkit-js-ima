// @flow
//import {PlayerMiddlewareBase} from '../node_modules/playkit-js/src/playkit.js'
import {PlayerMiddlewareBase} from 'playkit-js'
import State from './state'

export default class ImaMiddleware extends PlayerMiddlewareBase {
  context: any;

  constructor(pluginContext: any) {
    super();
    this.context = pluginContext;
  }

  play(next: Function): void {
    this.context.preparePromise.then(() => {
      let fsm = this.context.getStateMachine();
      if (fsm.is(State.LOADED)) {
        this.context.initialize();
      } else {
        if (fsm.is(State.PAUSED)) {
          this.context.resumeAd();
        } else {
          super.play(next);
        }
      }
    }).catch((e) => {
      this.context.destroy();
      this.context.logger.error(e);
    });
  }

  pause(next: Function): void {
    let fsm = this.context.getStateMachine();
    if (fsm.is(State.PLAYING)) {
      this.context.pauseAd();
    } else {
      super.pause(next);
    }
  }
}

