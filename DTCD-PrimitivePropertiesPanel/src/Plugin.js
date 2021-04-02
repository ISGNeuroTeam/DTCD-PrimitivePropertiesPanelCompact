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

    const logSystem = new LogSystemAdapter();
    logSystem.info(`Start instantiation of ${pluginMeta.name} plugin`);
    logSystem.debug(`Create LogSystemAdapter instance in ${pluginMeta.name} plugin`);

    const VueJS = this.getDependence('Vue');
    logSystem.debug(`Get Vue dependence in ${pluginMeta.name} plugin`);

    const eventSystem = new EventSystemAdapter();
    logSystem.debug(`Create EventSystemAdapter instance in ${pluginMeta.name} plugin`);

    const data = { guid, logSystem, eventSystem };

    logSystem.debug(`Creating Vue instance in ${pluginMeta.name} plugin`);
    new VueJS.default({
      data: () => data,
      render: h => h(PluginComponent),
    }).$mount(selector);

    logSystem.info(`End of instantiation of ${pluginMeta.name} plugin`);
  }

}
