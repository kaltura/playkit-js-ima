# Configuration & API

### Table of Contents

* [CompanionsConfigObject][1]
  * [Properties][2]
  * [Examples][3]
* [google.ima.CompanionAdSelectionSettings.SizeCriteria][4]
* [CompanionAdObject][5]
  * [Properties][6]
* [google.ima.AdsRenderingSettings][7]
* [ImaConfigObject][8]
  * [Properties][9]
  * [Examples][10]
* [ImaAdsController][11]
  * [Parameters][12]
  * [skipAd][13]
* [Ima][14]
  * [Parameters][15]
  * [skipAd][16]
  * [resumeAd][17]
  * [pauseAd][18]
  * [getStateMachine][19]
  * [getMiddlewareImpl][20]
  * [getAdsController][21]
  * [reset][22]
  * [destroy][23]
  * [initialUserAction][24]
  * [defaultConfig][25]
  * [loadPromise][26]
  * [isValid][27]

## CompanionsConfigObject

Type: [Object][28]

### Properties

* `ads` **[Object][28]** Companion ads. Represented as a key-value object where the key is the ad id ([string][29]) and the value is the companion ad object ([CompanionAdObject][5]).
* `sizeCriteria` **[google.ima.CompanionAdSelectionSettings.SizeCriteria][30]?** Available choices for size selection criteria. The user can specify any of these choices for selecting companion ads.

### Examples

```javascript
{
  sizeCriteria: 'SELECT_EXACT_MATCH',
  ads: {
    testCompanionSquare: {
      width: 300,
      height: 250
    },
    testCompanionLong: {
      width: 728,
      height: 90
    }
  }
}
```

## google.ima.CompanionAdSelectionSettings.SizeCriteria

[google.ima.CompanionAdSelectionSettings.SizeCriteria][31]

## CompanionAdObject

Type: [Object][28]

### Properties

* `width` **[number][32]** Width of the companion ad.
* `height` **[number][32]** Height of the companion ad.

## google.ima.AdsRenderingSettings

[google.ima.AdsRenderingSettings][33]

## ImaConfigObject

Type: [Object][28]

### Properties

* `adTagUrl` **[string][34]** Specifies the ad tag url that is requested from the ad server.
* `adsResponse` **[string][34]?** Specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url (if `adTagUrl` is not set).
* `debug` **[boolean][35]?** If set to true, loads IMA SDK in debug mode.
* `disableMediaPreload` **[number][32]?** Whether to disable media pre loading while ad is playing. If set to `true`, the player will start loading the content media just after the ad break will end (incase of preroll ad). This will also overrides `config.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete` no matters its value and sets it to `false`.
* `adsRenderingSettings` **[google.ima.AdsRenderingSettings][36]?** Defines parameters that control the rendering of ads.
* `companions` **[CompanionsConfigObject][37]?** Defines the companion ads.

### Examples

```javascript
// Default config
{
 debug: false,
 disableMediaPreload: false,
 adsRenderingSettings: {
   restoreCustomPlaybackStateOnAdBreakComplete: true,
   enablePreloading: false,
   useStyledLinearAds: false,
   useStyledNonLinearAds: true
   bitrate: -1,
   autoAlign: true
 },
  companions: {
    sizeCriteria: 'SELECT_EXACT_MATCH'
  }
}
```

## ImaAdsController

Controller for ima plugin.

### Parameters

* `context` **[Ima][38]** The ima plugin context.

### skipAd

Skip on an ad.

Returns **void**

## Ima

**Extends BasePlugin**

The ima plugin.

### Parameters

* `name` **[string][34]** The plugin name.
* `player` **Player** The player instance.
* `config` **[ImaConfigObject][39]** The plugin config.

### skipAd

Skips on an ad.

Returns **void**

### resumeAd

Resuming the ad.

Returns **DeferredPromise** The promise which when resolved starts the next handler in the middleware chain.

### pauseAd

Pausing the ad.

Returns **DeferredPromise** The promise which when resolved starts the next handler in the middleware chain.

### getStateMachine

Gets the state machine.

Returns **any** The state machine.

### getMiddlewareImpl

Gets the middleware.

Returns **ImaMiddleware** The middleware api.

### getAdsController

Gets the ads controller.

Returns **IAdsController** The ads api.

### reset

Resets the plugin.

Returns **void**

### destroy

Destroys the plugin.

Returns **void**

### initialUserAction

Initialize the ads for the first time.

Returns **DeferredPromise?** The promise which when resolved starts the next handler in the middleware chain.

### defaultConfig

The default configuration of the plugin.

Type: [Object][28]

### loadPromise

Promise for loading the plugin.
Will be resolved after:

1.  Ima script has been loaded in the page.
2.  The ads manager has been loaded and ready to start.

Type: [Promise][40]&lt;any>

### isValid

Whether the ima plugin is valid.

[1]: #companionsconfigobject
[2]: #properties
[3]: #examples
[4]: #googleimacompanionadselectionsettingssizecriteria
[5]: #companionadobject
[6]: #properties-1
[7]: #googleimaadsrenderingsettings
[8]: #imaconfigobject
[9]: #properties-2
[10]: #examples-1
[11]: #imaadscontroller
[12]: #parameters
[13]: #skipad
[14]: #ima
[15]: #parameters-1
[16]: #skipad-1
[17]: #resumead
[18]: #pausead
[19]: #getstatemachine
[20]: #getmiddlewareimpl
[21]: #getadscontroller
[22]: #reset
[23]: #destroy
[24]: #initialuseraction
[25]: #defaultconfig
[26]: #loadpromise
[27]: #isvalid
[28]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[29]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[30]: #googleimacompanionadselectionsettingssizecriteria
[31]: https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.CompanionAdSelectionSettings.SizeCriteria
[32]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[33]: https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsRenderingSettings
[34]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[35]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[36]: #googleimaadsrenderingsettings
[37]: #companionsconfigobject
[38]: #ima
[39]: #imaconfigobject
[40]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
