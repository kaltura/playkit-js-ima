import {playkit} from 'playkit-js'
import ima from '../../src/ima'

describe('ImaPlugin', function () {
  it('should play mp4 stream with ads', (done) => {
    window.player = playkit({
      "sources": [{
        "mimetype": "video/mp4",
        "url": "http://www.html5videoplayer.net/videos/toystory.mp4"
      }],
      "plugins": {
        "ima": {
          // Pre-Mid-Post
          "adTagURL": "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator="
          // Pre
          // "adTagURL": "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator="
        }
      }
    });
    window.player.load().then(() => {
      window.player.play();
    });
  });
});
