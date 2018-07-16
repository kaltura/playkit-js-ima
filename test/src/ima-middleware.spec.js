import ImaMiddleware from '../../src/ima-middleware';
import State from '../../src/state';

describe('Ima Middleware', function() {
  let sandbox;
  let imaMiddleware;
  let fakeContext = {
    config: {},
    loadPromise: Promise.resolve(),
    player: {
      addEventListener: function() {},
      load: function() {},
      Event: {
        CHANGE_SOURCE_STARTED: 'changesourcestarted'
      }
    },
    setCurrentState: function(state) {
      this.currentState = state;
    },
    getStateMachine: function() {
      return {
        state: this.currentState
      };
    },
    initialUserAction: function() {
      return Promise.resolve();
    },
    resumeAd: function() {
      return Promise.resolve();
    },
    pauseAd: function() {
      return Promise.resolve();
    },
    destroy: function() {},
    logger: {
      error: function() {},
      debug: function() {}
    }
  };

  describe('play', function() {
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      imaMiddleware = null;
      fakeContext.setCurrentState('');
    });

    afterEach(function() {
      sandbox = sandbox.restore();
    });

    it('should initialUserAction', function(done) {
      let spy = sandbox.spy(fakeContext, 'initialUserAction');
      fakeContext.setCurrentState(State.LOADED);
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.play(function() {
        spy.should.have.been.calledOnce;
        done();
      });
    });

    it('should destory adsManager and resume playback in case of error', function(done) {
      let spy = sandbox.spy(fakeContext, 'destroy');
      fakeContext.setCurrentState(State.LOADED);
      fakeContext.initialUserAction = Promise.reject();
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.play(function() {
        spy.should.have.been.calledOnce;
        fakeContext.initialUserAction = Promise.resolve();
        done();
      });
    });

    it('should resumeAd', function(done) {
      let spy = sandbox.spy(fakeContext, 'resumeAd');
      fakeContext.setCurrentState(State.PAUSED);
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.play(function() {
        spy.should.have.been.calledOnce;
        done();
      });
    });

    it('should call next', function(done) {
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.play(function() {
        done();
      });
    });

    it('should destroy', function(done) {
      let spy1 = sandbox.spy(fakeContext, 'destroy');
      let spy2 = sandbox.spy(fakeContext.logger, 'error');
      fakeContext.loadPromise = Promise.reject();
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.play(function() {
        spy1.should.have.been.calledOnce;
        spy2.should.have.been.calledOnce;
        done();
      });
    });
  });

  describe('pause', function() {
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      imaMiddleware = null;
      fakeContext.setCurrentState('');
    });

    afterEach(function() {
      sandbox = sandbox.restore();
    });

    it('should pauseAd', function() {
      let spy = sandbox.spy(fakeContext, 'pauseAd');
      fakeContext.setCurrentState(State.PLAYING);
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.pause();
      spy.should.have.been.calledOnce;
    });

    it('should call next', function(done) {
      imaMiddleware = new ImaMiddleware(fakeContext);
      imaMiddleware.pause(function() {
        done();
      });
    });
  });
});
