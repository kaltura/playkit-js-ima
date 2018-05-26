// @flow
import {registerPlugin} from 'playkit-js'
import {Plugin} from './ima'

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export {VERSION, NAME};
export {Plugin};

/**
 * The plugin name.
 * @type {string}
 * @const
 */
const pluginName: string = "ima";

registerPlugin(pluginName, Plugin);
