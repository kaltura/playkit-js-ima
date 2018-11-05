# Handling VPAID Ads

It's recommend that when playing VPAID ads, the player will not add any custom UI of its own, which may result in interacting issues with VPAID ads.
<br>To make sure that won't happened, configure `useStyledLinearAds` and set it to `true` before VPAID ad starting to play. This will tell the player to let the IMA SDK to handle the UI itself.

**Configure on player setup**

```js
const player = KalturaPlayer.setup({
  plugins: {
    ima: {
      ...
      adsRenderingSettings: {
        useStyledLinearAds: true
      },
      ...
    }
  }
});
```

**Configure before change media**

```js
player.configure({
  plugins: {
    ima: {
      adsRenderingSettings: {
        useStyledLinearAds: true
      }
    }
  }
});
```
