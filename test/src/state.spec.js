import State from '../../src/state'

describe('Ima Plugin State', function () {
  it('should equals possible ima plugin states', () => {
    State.should.deep.equal({
      LOADING: "loading",
      LOADED: "loaded",
      PLAYING: "playing",
      PAUSED: "paused",
      IDLE: "idle",
      DONE: "done"
    });
  });
});
