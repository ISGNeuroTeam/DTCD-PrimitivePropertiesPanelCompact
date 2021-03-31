import pluginMeta from './Plugin.Meta';
import PluginComponent from './PluginComponent.vue';
import { PanelPlugin, EventSystemAdapter } from './../../DTCD-SDK/index';

export class Plugin extends PanelPlugin {
  static getRegistrationMeta() {
    return pluginMeta;
  }

  constructor(guid, selector) {
    super();
    let eventSystem = new EventSystemAdapter();
    const VueJS = this.getDependence('Vue');

    new VueJS.default({
      render: h => h(PluginComponent),
      data() {
        return {
          guid,
          eventSystem,
        };
      },
    }).$mount(selector);
  }
}
