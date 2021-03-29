import App from './App.vue';
import { PanelPlugin, EventSystemAdapter } from './../../DTCD-SDK';

export class Plugin extends PanelPlugin {
  static getRegistrationMeta() {
    return {
      type: 'panel',
      title: 'Панель свойств примитивов',
      name: 'PrimitivePropertiesPanel',
    };
  }

  constructor(guid, selector) {
    super();
    let eventSystem = new EventSystemAdapter();
    const VueJS = this.getDependence('Vue');

    new VueJS.default({
      render: h => h(App),
      data() {
        return {
          guid,
          eventSystem,
        };
      },
    }).$mount(selector);
  }
}
