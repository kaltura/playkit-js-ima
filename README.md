# PlayKit JS IMA - IMA plugin for the [PlayKit JS Player]

[![Build Status](https://travis-ci.org/kaltura/playkit-js-ima.svg?branch=master)](https://travis-ci.org/kaltura/playkit-js-ima)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

PlayKit JS IMA plugin integrates [IMA SDK for HTML5] with the [PlayKit JS Player].

PlayKit JS IMA is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

[ima sdk for html5]: https://developers.google.com/interactive-media-ads/docs/sdks/html5/
[flow]: https://flow.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Prerequisites

The plugin requires [PlayKit JS Player] to be loaded first.

The plugin uses the [IMA SDK for HTML5] Javascript SDK, if the SDK is already loaded on the page the plugin will use it, and if it's not then it will load it.

[playkit js player]: https://github.com/kaltura/playkit-js

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-ima.git
cd playkit-js-ima
yarn install
```

### Building

Then, build the player

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/playkit.js"></script>                     <!--PlayKit player-->
<script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script> <!--IMA SDK for HTML5-->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-ima.js"></script>                 <!--PlayKit IMA plugin-->
<div id="player-placeholder" style="height:360px; width:640px">
<script type="text/javascript">
var playerContainer = document.querySelector("#player-placeholder");
var config = {
 ...
 plugins: {
   ima: {
     adTagUrl: 'YOUR_AD_TAG_URL'
   }
 }
 ...
};
var player = playkit.core.loadPlayer(config);
playerContainer.appendChild(player.getView());
player.play();
</script>
```

## Documentation

* **[Configuration](docs/configuration.md)**
* **Events**

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[karma]: https://karma-runner.github.io/1.0/index.html

```
yarn run test
```

You can test individual browsers:

```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-ima/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
