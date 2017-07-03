// @flow
import {PlayerMiddlewareBase} from '../node_modules/playkit-js/src/playkit.js'
// import {PlayerMiddlewareBase} from 'playkit-js'
import State from './state'

export default class ImaMiddleware extends PlayerMiddlewareBase {
  context: any;

  constructor(pluginContext: any) {
    super();
    this.context = pluginContext;
  }

  play(next: Function): void {
    this.context.prepareIma
      .then(() => {
        let stateMachine = this.context.getStateMachine();
        if (stateMachine.is(State.LOADED)) {
          this.context.start();
        } else {
          if (stateMachine.current === State.PAUSED) {
            this.context.resumeAd();
          } else {
            super.play(next);
          }
        }
      })
      .catch((e) => {
        this.context.destroy();
        this.context.logger.error(e);
      });
  }

  pause(next: Function): void {
    let stateMachine = this.context.getStateMachine();
    if (stateMachine.is(State.PLAYING)) {
      this.context.pauseAd();
    } else {
      super.pause(next);
    }
  }
}

