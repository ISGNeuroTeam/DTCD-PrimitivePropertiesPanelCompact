<template>
  <transition name="fade" mode="out-in">
    <NoPrimitiveSelected v-if="!primitiveID" />
    <div v-else class="panel-content">
      <OTLModalWindow
        v-if="isModalVisible"
        @close="closeModal"
        @savedOTL="handleOTL"
        :otlData="tempValue"
      />
      <div class="panel-header">
        <div class="primitive-info">
          <input readonly type="text" tabindex="-1" class="node-id" :value="primitiveID" />
          <input readonly type="text" tabindex="-1" class="node-title" :value="nodeTitle" />
        </div>
      </div>
      <div class="properties-container">
        <div class="property-list" ref="propertyList">
          <div class="prop-header">
            <div>
              <p>{{ primitiveID }} properties:</p>
            </div>
            <div class="btn add-prop-btn" title="Add property" @click="addNewPropertyForm">
              <i class="fas fa-plus icon" />
            </div>
          </div>
          <div v-for="(prop, propName) in propertyList" :key="propName" class="property-card">
            <div class="card-header">
              <div class="prop-info">
                <div class="prop-name">
                  <!-- For scroll property name -->
                  <input readonly tabindex="-1" type="text" :value="propName" />
                </div>
                <div class="prop-value">
                  <span v-if="prop.status === 'complete'" :title="prop.value" v-text="prop.value" />
                  <span v-else>
                    <StatusIcon v-if="prop.status === 'error'" :status="'error'" />
                    <StatusIcon v-if="prop.status === 'inProgress'" :status="'inProgress'" />
                  </span>
                </div>
              </div>
              <div
                class="btn delete-prop-btn"
                title="Delete property"
                @click="deleteProperty(propName)"
              >
                <i class="far fa-trash-alt icon" />
              </div>
            </div>
            <div class="card-content">
              <select class="prop-type" v-model="prop.type">
                <option
                  v-for="option in propertyTypes"
                  :value="
                    $root.dataSourceSystem.dataSourceTypes.includes(option) ? 'datasource' : option
                  "
                  :key="option"
                  v-text="option.toUpperCase()"
                />
              </select>
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
                class="prop-expression"
                placeholder="Enter expression"
              />
            </div>
          </div>

          <div
            v-for="(prop, propName) in addedPropertiesList"
            :key="propName"
            class="property-card"
          >
            <div class="card-header">
              <div class="prop-info">
                <div class="prop-name">
                  <input
                    v-model="addedPropertiesList[propName].name"
                    :ref="propName"
                    class="editable"
                    type="text"
                    placeholder="Enter name..."
                  />
                </div>
                <div class="prop-value">
                  <div
                    class="btn confirm-add-prop-btn"
                    :class="{ disabled: addedPropertiesList[propName].name.length <= 0 }"
                    title="Add property"
                    @click="addPropertyToPrimitive(propName)"
                  >
                    <i class="fas fa-check icon" />
                  </div>
                </div>
              </div>
              <div
                class="btn delete-prop-btn"
                title="Delete property"
                @click="deleteAddedProperty(propName)"
              >
                <i class="far fa-trash-alt icon" />
              </div>
            </div>
            <div class="card-content">
              <select class="prop-type" v-model="addedPropertiesList[propName].type">
                <option
                  v-for="option in propertyTypes"
                  :key="option"
                  :value="option"
                  v-text="option.toUpperCase()"
                />
              </select>
              <textarea
                class="prop-expression"
                placeholder="Enter expression"
                rows="1"
                v-model="addedPropertiesList[propName].expression"
              />
            </div>
          </div>
          <!-- <div v-for="port in portList" :key="port" class="property-card">
          <div class="card-header">
            <div class="prop-info">
              <div class="prop-name">
                For scroll property name
                <input readonly tabindex="-1" type="text" :value="port.primitiveID" />
              </div>
              <div class="prop-value">
                <span
                  v-if="port.properties.status.status === 'complete'"
                  :title="port.properties.status.value"
                  v-text="port.properties.status.value"
                />
                <span v-else>
                  <StatusIcon v-if="port.properties.status.status === 'error'" :status="'error'" />
                  <StatusIcon v-if="port.properties.status.status === 'inProgress'" :status="'inProgress'" />
                </span>
              </div>
            </div>
            <div class="btn delete-prop-btn" title="Delete property" @click="deletePort(port)">
              <i class="far fa-trash-alt icon" />
            </div>
          </div>
          <div class="card-content">
            <label>status:</label>
            <textarea
              v-model="port.properties.status.expression"
              rows="1"
              class="prop-expression"
              placeholder="Enter expression"
            />
          </div>
        </div> -->
        </div>
        <div class="property-list" ref="propertyList" v-for="port in portList" :key="port">
          <div class="prop-header">
            <div>
              <p>{{ port.primitiveID }} properties:</p>
            </div>
            <div
              class="btn add-prop-btn"
              title="Add property"
              @click="addNewPortPropertyForm(port)"
            >
              <i class="fas fa-plus icon" />
            </div>
          </div>
          <div v-for="(prop, propName) in port.properties" :key="propName" class="property-card">
            <div class="card-header">
              <div class="prop-info">
                <div class="prop-name">
                  <!-- For scroll property name -->
                  <input readonly tabindex="-1" type="text" :value="propName" />
                </div>
                <div class="prop-value">
                  <span v-if="prop.status === 'complete'" :title="prop.value" v-text="prop.value" />
                  <span v-else>
                    <StatusIcon v-if="prop.status === 'error'" :status="'error'" />
                    <StatusIcon v-if="prop.status === 'inProgress'" :status="'inProgress'" />
                  </span>
                </div>
              </div>
              <div
                class="btn delete-prop-btn"
                title="Delete property"
                @click="deletePortProperty(port, propName)"
              >
                <i class="far fa-trash-alt icon" />
              </div>
            </div>
            <div class="card-content">
              <select class="prop-type" v-model="prop.type">
                <option
                  v-for="option in propertyTypes"
                  :value="
                    $root.dataSourceSystem.dataSourceTypes.includes(option) ? 'datasource' : option
                  "
                  :key="option"
                  v-text="option.toUpperCase()"
                />
              </select>
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
                class="prop-expression"
                placeholder="Enter expression"
              />
            </div>
          </div>

          <div
            v-for="(prop, index) in addedPortPropertiesList[port.primitiveID]"
            :key="prop"
            class="property-card"
          >
            <div class="card-header">
              <div class="prop-info">
                <div class="prop-name">
                  <input
                    v-model="addedPortPropertiesList[port.primitiveID][index].name"
                    class="editable"
                    type="text"
                    placeholder="Enter name..."
                  />
                </div>
                <div class="prop-value">
                  <div
                    class="btn confirm-add-prop-btn"
                    title="Add property"
                    :class="{
                      disabled: addedPortPropertiesList[port.primitiveID][index].name.length <= 0,
                    }"
                    @click="addPortPropertyToPrimitive(prop, port)"
                  >
                    <i class="fas fa-check icon" />
                  </div>
                </div>
              </div>
              <div
                class="btn delete-prop-btn"
                title="Delete property"
                @click="deleteAddedPortProperty(port, index)"
              >
                <i class="far fa-trash-alt icon" />
              </div>
            </div>
            <div class="card-content">
              <select
                class="prop-type"
                v-model="addedPortPropertiesList[port.primitiveID][index].type"
              >
                <option
                  v-for="option in propertyTypes"
                  :key="option"
                  :value="option"
                  v-text="option.toUpperCase()"
                />
              </select>
              <textarea
                class="prop-expression"
                placeholder="Enter expression"
                rows="1"
                v-model="addedPortPropertiesList[port.primitiveID].expression"
              />
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
import OTLModalWindow from '@/components/OTLModalWindow';

export default {
  name: 'PrimitivePropertiesPanel',
  components: { NoPrimitiveSelected, StatusIcon, OTLModalWindow },
  data: ({ $root }) => ({
    guid: $root.guid,
    logSystem: $root.logSystem,
    eventSystem: $root.eventSystem,
    pluginInstance: $root.pluginInstance,
    primitiveID: '',
    nodeTitle: '',
    propertyList: {},
    propertyStatusList: {},
    propertyTypes: ['expression'],
    newPropsCount: 1,
    addedPropertiesList: {},
    addedPortPropertiesList: {},
    portList: [],
    isModalVisible: false,
    tempValue: {},
    editableOTL: null,
  }),
  mounted() {
    this.propertyTypes.push(...this.$root.dataSourceSystem.dataSourceTypes);
    this.logSystem.debug('Set types of DataSourceSystem');

    this.logSystem.debug('BroadcastPrimitiveInfo event subscription');
  },
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
    processNodeProperty(propName,expression){
      this.primitiveProperties[propName].expression = expression
    },
    processPrimitiveEvent(event = {}) {
      this.logSystem.debug(`Start propcessing event BroadcastPrimitiveInfo`);
      let { primitiveTag: primitive = {}, ports } = event;
      this.portList = ports
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

    processLivedashPrimitiveDeleteEvent(event = {}) {
      let { args } = event;
      // Check if label by nextline
      if (args.text) this.nodeTitle = '';

      if (args.tag && args.tag.primitiveID === this.primitiveID) {
        this.primitiveID = '';
        this.nodeTitle = '';
        this.newPropsCount = 1;
        this.propertyList = {};
        this.addedPropertiesList = {};
      }
    },

    deleteProperty(propName) {
      this.$delete(this.propertyList, propName);
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

$panel-header-height: 60px;
$c-blue: #2196f3;
$c-red: #ef5350;
$c-green: #4caf50;

.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    border: thin solid #757575;
    border-radius: 50%;
    cursor: pointer;
    transition: $transition-time;

    .icon {
      color: #757575;
      font-size: 15px;
      transition: $transition-time;
    }

    &.add-prop-btn {
      border-color: $c-blue;

      .icon {
        color: $c-blue;
      }

      &:hover {
        background-color: $c-blue;

        .icon {
          color: #fff;
          transform: rotate(180deg);
        }
      }
    }

    &.delete-prop-btn {
      flex-shrink: 0;
      border-color: $c-red;

      .icon {
        color: $c-red;
      }

      &:hover {
        background-color: $c-red;

        .icon {
          color: #fff;
        }
      }
    }

    &.confirm-add-prop-btn {
      border-color: $c-green;

      .icon {
        color: $c-green;
      }

      &:hover {
        background-color: $c-green;

        .icon {
          color: #fff;
        }
      }
    }

    &.disabled {
      pointer-events: none;
      border-color: #959595;

      .icon {
        color: #959595;
      }
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: $panel-header-height;
    background-color: #fff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.25);
    padding: 0 20px;
    position: absolute;
    top: 0;
    left: 0;

    .primitive-info {
      display: flex;
      flex-direction: column;
      flex: 1 0;

      > input {
        border: none;
        outline: none;
        padding-right: 20px;
      }

      .node-id {
        font-size: 15px;
        font-family: monospace;
      }

      .node-title {
        color: #656565;
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }

  .properties-container {
    margin-top: 60px;
    overflow-y: scroll;
  }
  .property-list {
    padding-bottom: 20px;

    .prop-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
    }

    .section-title {
      margin-top: 10px;
      margin-left: 10px;
    }

    .property-card {
      display: flex;
      flex-direction: column;
      padding: 0 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .prop-info {
          display: flex;
          flex: 1 0;

          .prop-name {
            display: flex;
            flex: 1 0;

            > input {
              display: block;
              width: 100%;
              cursor: default;
              font-size: 15px;
              font-family: monospace;
              border: none;
              outline: none;

              &.editable {
                cursor: text;
              }
            }
          }

          .prop-value {
            display: flex;
            justify-content: flex-end;
            flex: 1 0;
            font-size: 15px;
            padding: 0 20px;
          }
        }
      }

      .card-content {
        display: flex;
        align-items: start;
        margin-top: 15px;

        $select-height: 20px;

        .prop-type {
          display: block;
          height: $select-height;
          outline: none;
        }
        .otl-button {
          min-width: 100px;
          margin-left: 20px;
        }

        .prop-expression {
          flex: 1 0;
          font-family: monospace;
          min-height: $select-height;
          max-height: 100px;
          margin-left: 20px;
          outline: none;
          resize: vertical;
        }
      }
    }
  }
}
</style>
