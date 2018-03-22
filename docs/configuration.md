## Configuration
IMA plugin configuration parameters are provided whenever a player instance is created.
```js
var config = {
  plugins: {
    ima: {
      // IMA configuration here      
    }
  }
};
var player = KalturaPlayer.setup(config);
```

#### Configuration Structure  

The configuration uses the following structure:

```js
{
  debug: boolean,
  adTagUrl: string,
  adsResponse: string,
  disableMediaPreload: boolean,
  disablesetDisableCustomPlaybackForIOS10PlusUserCache: boolean,
  adsRenderingSettings: Object,
  companions: Object
}
```

#### Default Configuration Values
```js
{
 debug: false,
 disableMediaPreload: false,
 setDisableCustomPlaybackForIOS10Plus: null,
 adsRenderingSettings: {
   restoreCustomPlaybackStateOnAdBreakComplete: true,
   useStyledLinearAds: false,
   useStyledNonLinearAds: true
 },
 companions: {
   ads: null,
   sizeCriteria: 'SELECT_EXACT_MATCH'
 }
}
```
##
>### config.adTagUrl
>##### Type: `string`
>##### Default: `-`
>##### Description: Specifies the ad tag url that is requested from the ad server (if `adsResponse` is not set).
##
>### config.adsResponse
>##### Type: `string`
>##### Default: `-`
>##### Description: Specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url (if `adTagUrl` is not set).
##
>### config.debug
>##### Type: `boolean`
>##### Default: `false`
>##### Description: If set to true, loads IMA SDK in debug mode.
##
>### config.disableMediaPreload
>##### Type: `boolean`
>##### Default: `false`
>##### Description: Whether to disable media pre loading while ad is playing.
>If set to `true`, the player will start loading the content media just after the ad break will end (incase of preroll ad).
>This will also overrides `config.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete` no matters its value and sets it to `false`.
##
>### config.adsRenderingSettings
>##### Type: `Object`
>##### Default:
>```js
>{
> restoreCustomPlaybackStateOnAdBreakComplete: true,
> useStyledLinearAds: false,
> useStyledNonLinearAds: true
>}
>```
>##### Description: Defines parameters that control the rendering of ads.
>> ### config.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete
>>##### Type: `boolean`
>>##### Default: `true`
>>##### Description: Specifies whether or not the SDK should restore the custom playback state after an ad break completes. This is setting is used primarily when the publisher passes in its content player to use for custom ad playback.
>>##
>> ### config.adsRenderingSettings.useStyledLinearAds
>>##### Type: `boolean`
>>##### Default: `false` for Desktops, `true` for Mobile devices.
>>##### Description: Render linear ads with full IMA UI styling instead of player UI styling.
>>##
>> ### config.adsRenderingSettings.useStyledNonLinearAds
>>##### Type: `boolean`
>>##### Default: `true`
>>##### Description: Render non-linear ads with a close and recall button.
##
>### config.companions
>##### Type: `Object`
>##### Default: 
>```js
>{
> ads: null,
> sizeCriteria: 'SELECT_EXACT_MATCH'
>}
>```
>##### Description: Defines the companion ads.
>> ### config.companions.ads
>>##### Type: `Object`
>>```js
>>{
>>  companionAdId: {
>>    width: number,
>>    height: number
>>  },
>>  ...
>>}
>>```
>>##### Default: `-`
>>##### Description: Defines a key-value pairs of companion ads.
>> The key defines the div id and the value defines the div dimensions.
>>##
>> ### config.companions.sizeCriteria
>>##### Type: `string`
>>##### Default: `'SELECT_EXACT_MATCH'`
>>##### Description: Available choices for size selection criteria.
>>Possible values: 
>>
>>Value | Description
>>--- | --- 
>>`IGNORE` | Specifies that size should be ignored when choosing companions.
>>`SELECT_EXACT_MATCH` | Specifies that only companions that match the size of the companion ad slot exactly should be chosen. 
>>`SELECT_NEAR_MATCH` | Specifies that any companion close to the size of the companion ad slot should be chosen. 
