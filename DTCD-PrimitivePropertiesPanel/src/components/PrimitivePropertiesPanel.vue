<template>
  <transition name="fade" mode="out-in">
    <div class="PrimitivePropertiesPanel">
      <ElementSettings
        v-if="isModalVisible"
        @close="closeModal"
        @savedOTL="handleOTL"
        :otlData="tempValue"
      />
      <div class="PanelHeader">
        <div class="PrimitiveTitle">
          <base-heading theme="theme_subheaderSmall" >
            <input placeholder="PrimitivePropertiesPanel" readonly type="text" tabindex="-1" class="NodeId" :value="primitiveID" /> 
          </base-heading>
          <input
            readonly
            placeholder="подзаголовок"
            type="text"
            tabindex="-1"
            class="NodeTitle"
            :value="nodeTitle.replace(/(<([^>]+)>)/gi, '')"
          />
        </div>
      </div>

      <base-expander open="true" class="AddNewProperty">
        <div slot="summary" class="ExpanderTitle">Создать новое свойство</div>
        <base-tabs>
          <div slot="tab" tab-name="Свойство">
            <base-input class="Input" label="Название" placeholder="Название свойства"></base-input>
            <base-button
              size="big"
              width="full"
            >Добавить свойство
            </base-button>
          </div>

          <div slot="tab" tab-name="Порт">
            <base-select 
              class="Input" 
              label="Тип порта" 
              placeholder="Порт"
            >
              <div slot="item" value="InPort">InPort</div>
              <div slot="item" value="OutPort">OutPort</div>
              <div slot="item" value="InOutPort">InOutPort</div>
            </base-select>
            <base-button
              size="big"
              width="full"
            >Добавить порт
            </base-button>
          </div>
        </base-tabs>
      </base-expander>
      
      <NoPrimitiveSelected v-if="!primitiveID" />
      <div v-else>
        <div class="SectionSearch">
          <h2 class="SectionSearchTitle">Свойства и порты</h2>
          <base-input 
            type="search" 
            placeholder="Поиск" 
            size="small"
          >
          <span slot="icon-left" class="FontIcon name_searchSmall size_md"></span>
          </base-input>
        </div>
        <div class="PropertiesWrapper">
          <div class="PropertyList" ref="propertyList">
            
           <!-- <div v-for="(prop, propName) in propertyList" :key="propName" class="PropertyCard">
              <div class="CardContent">
                <div class="PropertyInfo">
                  <div class="PropertyValue">
                    <span v-if="prop.status === 'complete'" v-text="prop.value" />
                    <span v-else>
                      <StatusIcon v-if="prop.status === 'error'" :status="'error'" />
                      <StatusIcon v-if="prop.status === 'inProgress'" :status="'inProgress'" />
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-content">
                <button
                  v-if="prop.type === 'datasource'"
                  type="button"
                  class="otl-button"
                  @click="showModal(prop)"
                >
                  Edit {{ prop.expression.type }}
                </button>
                <textarea
                  v-else
                  v-model="prop.expression"
                  rows="1"
                  placeholder="Enter expression"
                />
              </div>
            </div> -->

            <div v-for="port in portList" :key="port" class="PropertyCard">
              <div class="CardContent">
                <div class="PropertyInfo">
                  <div class="Test">
                    <div>
                      <input class="PropertyName" readonly tabindex="-1" type="text" :value="port.primitiveName" />
                      <span class="PropertyType">Expression</span>
                    </div>
                    <div class="PropertyValue">
                      <span class="ValueText">Value:</span>
                      <span class="MainContent"
                        v-if="port.properties.status.status === 'complete'"
                        v-text="port.properties.status.value"
                      />
                      <span v-else>
                        <StatusIcon
                          v-if="port.properties.status.status === 'error'"
                          :status="'error'"
                        />
                        <StatusIcon
                          v-if="port.properties.status.status === 'inProgress'"
                          :status="'inProgress'"
                        />
                      </span>
                    </div>
                  </div>
                  <div class="IconsWrapper">
                    <span class="FontIcon name_show size_lg"></span>
                    <span  
                      @click="showModal(port.properties.status)" 
                      class="FontIcon name_edit size_lg"
                    > 
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import NoPrimitiveSelected from '@/components//NoPrimitiveSelected';
import StatusIcon from '@/components/StatusIcon';
import ElementSettings from '@/components/ElementSettings';

export default {
  name: 'PrimitivePropertiesPanel',
  components: { NoPrimitiveSelected, StatusIcon, ElementSettings },
  data: ({ $root }) => ({
    guid: $root.guid,
    logSystem: $root.logSystem,
    eventSystem: $root.eventSystem,
    primitiveID: '',
    nodeTitle: '',
    propertyList: {},
    propertyStatusList: {},
    propertyTypes: ['expression', 'OTL'],
    newPropsCount: 1,
    addedPropertiesList: {},
    addedPortPropertiesList: {},
    portList: [],
    isModalVisible: false,
    tempValue: {},
    editableOTL: null,
    primitiveProperties: {},
  }),
  methods: {
    showModal(prop) {
      if (typeof prop.expression !== 'string') {
        this.tempValue = prop.expression;
      } else {
        const defaultTimestamp = Math.floor(+new Date() / 1000);
        this.tempValue = {
          original_otl: '',
          tws: defaultTimestamp,
          twf: defaultTimestamp,
          cache_ttl: 60,
        };
      }
      this.editableOTL = prop;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    processPrimitiveEvent(event = {}) {
      this.logSystem.debug(`Start propcessing event BroadcastPrimitiveInfo`);
      let { primitiveTag: primitive = {}, ports } = event;
      this.portList = ports;
      this.primitivePorts = ports;

      const { primitiveID = '', nodeTitle = '', properties = {} } = primitive;

      for (let prop in properties) {
        if (!properties[prop].type) properties[prop].type = 'expression';
        if (!properties[prop].expression) properties[prop].expression = '';
      }
      this.primitiveProperties = properties;
      this.primitiveID = primitiveID;
      this.nodeTitle = nodeTitle;
      this.propertyList = properties;
      this.newPropsCount = 1;
      this.addedPropertiesList = {};

      this.logSystem.debug(`End of propcessing event BroadcastPrimitiveInfo`);
    },

    processLivedashPrimitiveDeleteEvent(eventData) {
      const { text, tag } = eventData;
      // Check if label by nextline
      if (text) this.nodeTitle = '';

      if (tag && tag.primitiveID === this.primitiveID) {
        this.primitiveID = '';
        this.nodeTitle = '';
        this.newPropsCount = 1;
        this.propertyList = {};
        this.addedPropertiesList = {};
      }
    },

    deleteProperty(propName) {
      this.$delete(this.propertyList, propName);
      this.$delete(this.primitiveProperties, propName);
      this.logSystem.debug(`Deleting property ${propName} from ${this.primitiveID} node`);
      this.logSystem.info(`Deleting property ${propName} from ${this.primitiveID} node`);
    },

    deleteAddedProperty(propName) {
      this.$delete(this.addedPropertiesList, propName);
      this.logSystem.debug(`Сancel adding a new property to ${this.primitiveID} node`);
      this.logSystem.info(`Сancel adding a new property to ${this.primitiveID} node`);
    },

    deletePort(port) {
      console.log(port);
    },
    deletePortProperty(port, propName) {
      this.$delete(port.properties, propName);
    },
    deleteAddedPortProperty(port, index) {
      this.addedPortPropertiesList[port.primitiveID].splice(index, 1);
    },
    addNewPortPropertyForm(port) {
      const property = {
        name: '',
        value: '',
        type: 'expression',
        status: '',
        expression: '',
      };
      if (!this.addedPortPropertiesList[port.primitiveID]) {
        this.$set(this.addedPortPropertiesList, port.primitiveID, [property]);
      } else this.addedPortPropertiesList[port.primitiveID].push(property);
    },
    async addPortPropertyToPrimitive(prop, port) {
      const { name, type, status, value, expression } = prop;
      const existedProperties = Object.keys(port.properties).map(key => key.toLocaleLowerCase());

      if (!existedProperties.includes(name.toLocaleLowerCase())) {
        await this.$set(port.properties, name, { value, type, status, expression });
        this.logSystem.debug(`Adding property ${name} from ${this.primitiveID} node`);
        this.logSystem.info(`Adding property ${name} from ${this.primitiveID} node`);

        const index = this.addedPortPropertiesList[port.primitiveID].indexOf(prop);
        this.addedPortPropertiesList[port.primitiveID].splice(index, 1);
      }
    },

    addNewPropertyForm() {
      const propName = `prop${this.newPropsCount}`;
      const property = {
        name: '',
        value: '',
        type: 'expression',
        status: '',
        expression: '',
      };
      this.$set(this.addedPropertiesList, propName, property);
      // this.$nextTick(() => this.$refs[propName][0].focus());
      // this.scrollPropertyListDown();
      this.newPropsCount += 1;
    },

    async addPropertyToPrimitive(propName) {
      const { name, type, status, value, expression } = this.addedPropertiesList[propName];
      const existedProperties = Object.keys(this.propertyList).map(key => key.toLocaleLowerCase());

      if (!existedProperties.includes(name.toLocaleLowerCase())) {
        await this.$set(this.propertyList, name, { value, type, status, expression });
        await this.$set(this.primitiveProperties, name, { value, type, status, expression });
        this.logSystem.debug(`Adding property ${name} from ${this.primitiveID} node`);
        this.logSystem.info(`Adding property ${name} from ${this.primitiveID} node`);

        await this.$delete(this.addedPropertiesList, propName);
      }
    },

    scrollPropertyListDown() {
      this.$nextTick(() => {
        const container = this.$refs.propertyList;
        container.scrollTop = container.scrollHeight;
        this.logSystem.debug(`Scrolling properties container down`);
      });
    },
    handleOTL(otlRequestData) {
      this.editableOTL.expression = otlRequestData;
      this.editableOTL = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../styles/base.scss';

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
    .NodeTitle,
    .PropertyName {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      border: none;
      outline: none;
      background-color: var(--background_main);
    }
  }

  .AddNewProperty {
    padding: 10px 10px 30px;
    border-bottom: 1px solid var(--border_secondary);
  }

  .ExpanderTitle {
    font-weight: 600;
    font-size: 17px;
  }

  .Input {
    padding-bottom: 30px;
  }

  .SectionSearch {
    display: flex;
    justify-content: space-between;
    padding: 12px 24px;
    align-items: center;
    margin-bottom: 10px;
  }

  .SectionSearchTitle {
    font-size: 17px;
  }

  .PropertiesWrapper {
    overflow-y: scroll;
  }

  .PropertyList {
    padding: 0 10px 20px;

    .PropertyCard {
      display: flex;
      flex-direction: column;
      padding: 12px;
      border-bottom: 2px solid var(--border_secondary);
    }

    .CardContent {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .PropertyInfo {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .Test {
      display: flex;
      overflow: hidden;
      margin-right: 20px;
    }

    .PropertyType {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--text_secondary);
      margin-top: 2px;
    }

    .PropertyName {
      display: block;
      cursor: default;
      font-size: 17px;
      font-weight: 700;  
      max-width: 80px;
      border: none;
      outline: none;
      color: var(--text_main);
    }

    .PropertyValue {
      color: var(--text_secondary);
      max-width: 80%;
      font-size: 17px;
      display: flex;
      align-self: center;
      overflow: hidden;
    }

    .ValueText {
      padding-right: 8px;
    }

    .MainContent {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    } 

    .IconsWrapper {
      display: flex;
      align-items: center;
    }
  }

  .FontIcon {
    cursor: pointer;

    &.name_searchSmall {
      color: var(--text_secondary);
    }

    &.name_show {
      padding-right: 20px;
    }
  }
}
</style>