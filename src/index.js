// @flow
import {registerPlugin} from '@playkit-js/playkit-js';
import {Ima} from './ima';

declare var __VERSION__: string;
declare var __NAME__: string;

export {Ima as Plugin};
export {__VERSION__ as VERSION, __NAME__ as NAME};

const pluginName: string = 'ima';

registerPlugin(pluginName, Ima);
