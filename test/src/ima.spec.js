import {playkit} from 'playkit-js'
import ima from '../../src/ima.js'

describe('ImaPlugin', function () {
  it('should play mp4 stream with ads', (done) => {
    window.player = playkit({
      "sources": [{
        "mimetype": "video/mp4",
        "url": "http://www.html5videoplayer.net/videos/toystory.mp4",
      }],
      "plugins": {
        "ima": {
          "adTagURL": "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator="
        }
      }
    });
    player.load().then(() => {
      player.play();
      setTimeout(() => {
        player.pause();
      }, 5000);
    });
  });
});
