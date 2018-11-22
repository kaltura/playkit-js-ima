import {ImaState} from '../../../ima-common/src/ima-state';

describe('Ima Plugin State', function() {
  it('should equals possible ima plugin states', () => {
    ImaState.should.deep.equal({
      LOADING: 'loading',
      LOADED: 'loaded',
      PLAYING: 'playing',
      PAUSED: 'paused',
      IDLE: 'idle',
      DONE: 'done'
    });
  });
});
