// @flow
import {registerPlugin} from '@playkit-js/playkit-js';
import {Ima as Plugin} from './ima';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {Plugin, VERSION, NAME};

const pluginName: string = 'ima';

registerPlugin(pluginName, Plugin);
