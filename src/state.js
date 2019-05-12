// @flow

/**
 * The ima plugin possible states.
 * @type {Object}
 */
const State: {[state: string]: string} = {
  LOADING: 'loading',
  LOADED: 'loaded',
  PROCESS: 'process',
  PLAYING: 'playing',
  PAUSED: 'paused',
  IDLE: 'idle',
  DONE: 'done'
};

export {State};
