// @flow
import {registerPlugin} from 'playkit-js';
import Ima from './ima';

declare var __VERSION__: string;
declare var __NAME__: string;

export default Ima;
export {__VERSION__ as VERSION, __NAME__ as NAME};

/**
 * The plugin name.
 * @type {string}
 * @const
 */
const pluginName: string = 'ima';

registerPlugin(pluginName, Ima);
