## Configuration

#### Configuration Structure

The configuration uses the following structure:

---

```js
{
  showAdBreakCuePoint?: boolean,
  adBreakCuePointStyle?: CuePointOptionsObject
}
```

##

> ### showAdBreakCuePoint
>
> ##### Type: boolean
>
> ##### Default: `false` - No cue points displayed for the ad breaks.
>
> ##### Description: Whether to show the ad breaks cue points.
>
> ##
>
> ### adBreakCuePointStyle
>
> ##### Type: [`CuePointOptionsObject`](https://github.com/kaltura/playkit-js-timeline/blob/main/docs/types.md#cuepointoptionsobject)
>
> ##### Default: `null` - Use the default cue point style.
>
> ##### Description: Style options for the ad breaks cue points.
>
> ##### Examples:
>
> Don't show The cue point for the ad breaks:
>
> ```js
> {
>   showAdBreakCuePoint: false;
> }
> ```
>
> Show The default cue point for the ad breaks:
>
> ```js
> {
>   showAdBreakCuePoint: true;
> }
> ```
>
> Show a custom cue point for the ad breaks:
>
> ```js
> {
>   showAdBreakCuePoint: true,
>   adBreakCuePointStyle: {
>     marker: {
>       width: 10,
>       color: 'rgb(255, 0, 0)'
>     }
>   }
> }
> ```
