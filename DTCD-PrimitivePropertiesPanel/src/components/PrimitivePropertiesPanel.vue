<template>
  <div class="PrimitivePropertiesPanel">
    <ElementSettings
      v-if="isPropSettingsVisible"
      :propData="editedPropData"
      @close="closePropSettings"
      @save="updateProp"
      @delete="deleteProp"
    />

    <FullValueView
      v-if="isFullValueVisible"
      :valueData="fullValueData"
      @close="closePropFullValue"
    />

    <div class="PanelHeader">
      <div class="PrimitiveTitle">
        <base-heading theme="theme_subheaderSmall" >
          <input
            class="NodeId"
            readonly
            type="text"
            tabindex="-1"
            placeholder="PrimitivePropertiesPanel"
            :value="primitiveID"
          />
        </base-heading>
        <input
          v-if="primitiveID"
          class="NodeTitle"
          readonly
          type="text"
          tabindex="-1"
          :value="nodeTitle.replace(/(<([^>]+)>)/gi, '')"
        />
      </div>
    </div>

    <NoPrimitiveSelected v-if="!primitiveID"/>

    <template v-else>
      <base-tabs class="TabContainer" @select="tabSelectHandler">
        <div slot="tab" tab-name="Свойства"></div>
        <div slot="tab" tab-name="Порты"></div>
      </base-tabs>

      <base-expander v-show="selectedTab === 0" open="true" class="Expander">
        <div slot="summary" class="ExpanderTitle">Создать новое свойство</div>
        <base-input
          ref="propName"
          :value="addedPropName"
          :disabled="!primitiveID"
          class="Input"
          label="Название"
          placeholder="Название свойства"
          @input="addedPropName = $event.target.value"
        />
        <base-button
          size="big"
          width="full"
          :disabled="primitiveID && !isAddPropButtonDisabled"
          @click="addPropertyToPrimitive"
        >
          Добавить свойство
        </base-button>
      </base-expander>

      <!-- NOT USED NOW -->
      <base-expander v-show="false" open="true" class="Expander">
        <div slot="summary" class="ExpanderTitle">Создать новый порт</div>
        <base-select
          ref="portType"
          class="Input PortTypeSelect"
          label="Тип порта"
          placeholder="Тип порта"
          @input="addedPortType = $event.target.value"
        >
          <div
            v-for="type in portTypes"
            :key="type"
            :value="type"
            slot="item"
            v-text="type"
          />
        </base-select>
        <base-button disabled size="big" width="full">Добавить порт</base-button>
      </base-expander>

      <div class="SelectedPrimitiveData" key="SelectedPrimitiveData">
        <div class="SectionSearch">
          <h2
            class="SectionSearchTitle"
            v-text="selectedTab === 0 ? 'Свойства' : 'Порты'"
          />
          <base-input
            type="search"
            placeholder="Поиск"
            size="small"
            @input="searchString = $event.target.value"
          >
            <span slot="icon-left" class="FontIcon name_searchSmall size_md Icon"></span>
          </base-input>
        </div>

        <div v-if="selectedTab === 0" class="PropertyList">
          <div
            v-for="(prop, propName) in propertyList"
            :key="propName"
            class="PropertyCard"
            v-show="propName.toLowerCase().includes(searchString.toLowerCase())"
          >
            <div class="PropertyDataWrapper">
              <div>
                <input
                  class="PropertyName"
                  readonly
                  tabindex="-1"
                  type="text"
                  :value="propName"
                />
                <span class="PropertyType" v-text="getPropType(prop, 'property')"/>
              </div>
              <div class="PropertyValue">
                <span class="ValueText" :class="{ error:  prop.status === 'error' }">
                  Value:
                </span>
                <span
                  v-if="prop.status === 'complete'"
                  class="ValueData"
                  v-text="prop.value"
                />
                <span
                  v-if="prop.status === 'error'"
                  class="ValueData error"
                >
                  <StatusIcon class="StatusIcon" :status="'error'"/>
                  Ошибка
                </span>
                <span
                  v-if="prop.status === 'inProgress'"
                  class="ValueData progress"
                >
                  <StatusIcon class="StatusIcon" :status="'inProgress'"/>
                  Загрузка данных
                </span>
              </div>
            </div>
            <div class="IconsWrapper">
              <span
                class="FontIcon name_show size_lg ShowIcon"
                @click="openPropFullValue(propName, prop.value)"
              />
              <span
                class="FontIcon name_edit size_lg"
                @click="openPropSettings(propName, prop)"
              />
            </div>
          </div>
        </div>

        <div v-if="selectedTab === 1" class="PropertyList">
          <div
            v-for="port in portList"
            :key="port"
            class="PropertyCard"
            v-show="port.primitiveName.toLowerCase().includes(searchString.toLowerCase())"
          >
            <div class="PropertyDataWrapper">
              <div>
                <input
                  class="PropertyName"
                  readonly
                  tabindex="-1"
                  type="text"
                  :value="port.primitiveName"
                />
                <span class="PropertyType" v-text="getPropType(port, 'port')"/>
              </div>
              <div class="PropertyValue">
                <span class="ValueText" :class="{ error: port.properties.status.status === 'error' }">
                  Value:
                </span>
                <span
                  v-if="port.properties.status.status === 'complete'"
                  class="ValueData"
                  v-text="port.properties.status.value"
                />
                <span
                  v-if="port.properties.status.status === 'error'"
                  class="ValueData error"
                >
                  <StatusIcon class="StatusIcon" :status="'error'"/>
                  Ошибка
                </span>
                <span
                  v-if="port.properties.status.status === 'inProgress'"
                  class="ValueData progress"
                >
                  <StatusIcon class="StatusIcon" :status="'inProgress'"/>
                  Загрузка данных
                </span>
              </div>
            </div>
            <div class="IconsWrapper">
              <span
                class="FontIcon name_show size_lg ShowIcon"
                @click="openPropFullValue(port.primitiveName, port.properties.status.value)"
              />
              <span
                class="FontIcon name_edit size_lg"
                @click="openPropSettings(port.primitiveName, port.properties.status, 'port')"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import NoPrimitiveSelected from '@/components//NoPrimitiveSelected';
import StatusIcon from '@/components/StatusIcon';
import FullValueView from '@/components/FullValueView';
import ElementSettings from '@/components/ElementSettings';

export default {
  name: 'PrimitivePropertiesPanel',
  components: {
    NoPrimitiveSelected,
    StatusIcon,
    FullValueView,
    ElementSettings,
  },
  data: ({ $root }) => ({
    logSystem: $root.logSystem,
    primitiveID: '',
    nodeTitle: '',
    propertyList: {},
    portList: [],
    isFullValueVisible: false,
    isPropSettingsVisible: false,
    selectedTab: 0,
    searchString: '',
    addedPropName: '',
    addedPortType: '',
    fullValueData: { prop: '', value: '' },
    editedPropData: { type: '', elem: null },
    portTypes: ['InPort', 'OutPort', 'InOutPort'],
  }),
  computed: {
    expanderTitle() {
      const titles = ['новое свойство', 'новый порт']
      return `Создать ${titles[this.selectedTab]}`;
    },

    isAddPropButtonDisabled() {
      const { isValid } = this.validateAddedPropName(this.addedPropName);
      return this.addedPropName.length < 1 ? false : isValid;
    },

    existedProps() {
      return Object.keys(this.propertyList);
    },
  },
  watch: {
    primitiveID() {
      this.$nextTick(() => {
        const { propName } = this.$refs;
        if (typeof propName.validation !== 'function') {
          propName.validation = v => this.validateAddedPropName(v);
        }
      });
    },
  },
  methods: {
    tabSelectHandler(event) {
      const { propName, portType } = this.$refs;
      const { tabIndex } = event.target.activeTab;
      propName.value = '';
      portType.value = 'InPort';
      this.selectedTab = tabIndex;
    },

    getPropType(prop, type = 'property') {
      const obj = type === 'port' ? prop.properties.status : prop;
      return obj.type === 'datasource' ? obj.expression.type : obj.type;
    },

    openPropSettings(propName = '', data = {}, propType = 'property') {
      this.editedPropData = { propName, propType, data };
      this.isPropSettingsVisible = true;
    },

    openPropFullValue(prop = '', val = '') {
      let value = val;

      if (typeof val !== 'string') {
        value = JSON.stringify(val, null, 2);
      }

      this.fullValueData = { prop, value };
      this.isFullValueVisible = true;
    },

    closePropSettings() {
      this.isPropSettingsVisible = false;
    },

    closePropFullValue() {
      this.isFullValueVisible = false;
    },

    validateAddedPropName(val) {
      const propNameRegexp = /^[_a-zA-Z]\w*$/;

      if (val.length < 1) {
        return { isValid: true };
      } else if (!propNameRegexp.test(val)) {
        return { isValid: false, message: 'Некорректное название свойства' };
      } else if (this.existedProps.includes(val)) {
        return { isValid: false, message: 'Свойство с таким названием уже существует' };
      }

      return { isValid: true };
    },

    processPrimitiveEvent(event = {}) {
      this.logSystem.debug(`Start propcessing BroadcastPrimitiveInfo event`);

      const { primitiveTag = {}, ports = [] } = event;
      const { primitiveID = '', nodeTitle = '', properties = {} } = primitiveTag;

      for (const prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          if (!properties[prop].type) properties[prop].type = 'expression';
          if (!properties[prop].expression) properties[prop].expression = '';
        }
      }

      this.portList = ports;
      this.primitiveID = primitiveID;
      this.nodeTitle = nodeTitle;
      this.propertyList = properties;

      this.logSystem.debug(`End of propcessing BroadcastPrimitiveInfo event`);
    },

    deleteProp(propData = {}) {
      const { propName, propType } = propData;

      if (propType !== 'property') return;

      this.$delete(this.propertyList, propName);
      this.logSystem.debug(`Deleting "${propName}" property from the ${this.primitiveID} node`);
      this.logSystem.info(`Deleting "${propName}" property from the ${this.primitiveID} node`);
    },

    addPropertyToPrimitive() {
      const name = this.addedPropName;
      this.addedPropName = '';
      if (!this.existedProps.includes(name)) {
        this.$set(this.propertyList, name, { type: 'expression', expression: '' });
        this.logSystem.debug(`Adding "${name}" property to the ${this.primitiveID} node`);
        this.logSystem.info(`Adding "${name}" property to the ${this.primitiveID} node`);
      }
    },

    updateProp(propData) {
      const { propName, propType, data } = propData;
      const { type, expression } = data;

      if (propType === 'property') {
        this.$set(this.propertyList, propName, { type, expression });
        this.logSystem.debug(`Updating "${propName}" property of the ${this.primitiveID} node`);
        this.logSystem.info(`Updating "${propName}" property of the ${this.primitiveID} node`);
      }

      if (propType === 'port') {
        const port = this.portList.find(p => p.primitiveName === propName);
        const { properties } = this.portList[this.portList.indexOf(port)];
        this.$set(properties, 'status', { type, expression });
        this.logSystem.debug(`Updating "${propName}" port of the ${this.primitiveID} node`);
        this.logSystem.info(`Updating "${propName}" port of the ${this.primitiveID} node`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Proxima Nova';
}

.PrimitivePropertiesPanel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  color: var(--text_main);
  background-color: var(--background_main);

  .PanelHeader {
    background-color: var(--background_main);
    border-bottom: 1px solid var(--background_secondary);
    padding: 10px;
    color: var(--title);

    .PrimitiveTitle {
      display: flex;
      flex-direction: column;
      flex: 1 0;
    }

    .NodeId {
      width: 100%;
      padding-bottom: 4px;
      padding-right: 20px;

      &::-webkit-input-placeholder {
        color: var(--title);
      }
    }

    .NodeTitle {
      font-size: 17px;
      padding-right: 20px;
      color: var(--title);

      &::-webkit-input-placeholder {
        color: var(--title);
      }
    }

    .NodeId,
    .NodeTitle {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      border: none;
      outline: none;
      background-color: var(--background_main);
    }
  }

  .TabContainer {
    padding: 10px 10px 0;
  }

  .Expander {
    padding: 10px 14px 30px;
    border-bottom: 1px solid var(--border_secondary);
  }

  .ExpanderTitle {
    font-weight: 600;
    font-size: 17px;
  }

  .Input {
    margin-top: 10px;
    margin-bottom: 20px;

    &.PortTypeSelect > [slot="item"] {
      padding: 6px 12px;
    }
  }

  .SelectedPrimitiveData {
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;

    .SectionSearch {
      display: flex;
      justify-content: space-between;
      padding: 12px 22px;
      align-items: center;
      border-bottom: 1px solid var(--border_secondary);

      .SectionSearchTitle {
        font-size: 17px;
      }

      .Icon {
        color: var(--text_secondary);
      }
    }

    .PropertyList {
      padding: 10px;
      overflow: auto;

      .PropertyCard {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        border-bottom: 2px solid var(--border_secondary);

        &:hover .IconsWrapper .FontIcon.ShowIcon {
          display: block;
        }

        .PropertyDataWrapper {
          display: flex;
          overflow: hidden;
          margin-right: 20px;
          flex-grow: 1;

          .PropertyName {
            display: block;
            cursor: default;
            font-size: 17px;
            font-weight: 700;
            max-width: 80px;
            padding-right: 15px;
            border: none;
            outline: none;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            color: var(--text_main);
            background-color: var(--background_main);
          }

          .PropertyType {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: var(--text_secondary);
            text-transform: capitalize;
            margin-top: 2px;
            user-select: none;
          }

          .PropertyValue {
            display: flex;
            align-items: center;
            color: var(--text_secondary);
            font-size: 17px;

            .ValueText {
              padding-right: 8px;
              user-select: none;

              &.error {
                color: var(--danger);
              }
            }

            .ValueData {
              display: flex;
              align-items: center;
              color: var(--text_main);
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;

              &.error {
                color: var(--danger);
                font-size: 15px;
                font-weight: 700;
              }

              &.progress {
                color: var(--border);
              }

              .StatusIcon {
                margin-right: 6px;
              }
            }
          }
        }

        .IconsWrapper {
          display: flex;
          align-items: center;

          .FontIcon {
            cursor: pointer;

            &.ShowIcon {
              display: none;
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
