import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';

import {
  PanelPlugin,
  LogSystemAdapter,
  EventSystemAdapter,
} from './../../DTCD-SDK/index';

export class Plugin extends PanelPlugin {

  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor (guid, selector) {
    super();

    const VueJS = this.getDependence('Vue');
    const logSystem = new LogSystemAdapter();
    const eventSystem = new EventSystemAdapter();

    const data = { guid, logSystem, eventSystem };

    new VueJS.default({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);
  }

}
