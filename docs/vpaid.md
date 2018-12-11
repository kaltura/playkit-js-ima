# Handling VPAID Ads

It's recommend that when playing VPAID ads, the player will not add any custom UI of its own, which may result in interacting issues with VPAID ads.
<br>To make sure that won't happened, configure `useStyledLinearAds` and set it to `true` before VPAID ad starts playing. This will tell the player to let the IMA SDK handle the UI itself.

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

# Handling VPAID Modes

If you require to alter the VpaidMode, simply change the value of the IMA player configuration 'ima.vpaidMode' accordingly.

### ima.vpaidMode

> ##### Type: `String`
>
> ##### Default: `ENABLED`
>
> ##### Description: Alters the VpaidMode.

### Values

> * `ENABLED` VPAID ads are enabled using a cross domain iframe. The VPAID ad cannot access the site. VPAID ads that depend on friendly iframe access may error. This is the default.
>
> * `DISABLED` VPAID ads will not play and an error will be returned.
>
> * `INSECURE` VPAID ads are enabled using a friendly iframe. This allows the ad access to the site via JavaScript.

**Configure on player setup**

```js
const player = KalturaPlayer.setup({
  plugins: {
    ima: {
      ...
       vpaidMode: 'ENABLED'
      ...
    }
  }
});
```
