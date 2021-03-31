<template>
  <div class="primitive-properties-panel-container">
        <label>{{ nodeID }}</label>
    <div v-if="!primitiveProperties">No primitive selected...</div>
    <div v-else>
      <div
        class="propertie-container"
        v-for="(propObj, propName) in primitiveProperties"
        :key="propName"
      >
        <label>{{ propName }}</label>
        <select v-model="propObj.type">
          <option v-for="option in options" :value="option" :key="option">
            {{ option }}
          </option>
        </select>
        <input placeholder="Enter value" v-model="propObj.value" @change="onPropertyChanged(propName)"/>
        <label>{{primitiveCalculated[propName]}}</label>
        <button @click="deleteProperty(propName)">Delete</button>
      </div>
      <input placeholder="Enter new prop" v-model="tempPropName" />
      <button @click="addProperty">Add</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrimitivePropertiesPanel',
  data() {
    return {
      primitiveCalculated:{},
      primitiveProperties: {},
      nodeID:null,
      options: ['expression', 'OTL'],
      tempPropName: '',
    };
  },
  mounted() {
    this.$root.eventSystem.subscribeEventNameByCallback('PrimitiveClicked', event => {
      Object.values(event.args.properties).forEach(prop => {
        if (!prop.type) prop.type = this.options[0];
      });
      if(event.args.properties) this.primitiveProperties = event.args.properties;
      if(event.args.calculated) this.primitiveCalculated = event.args.calculated
      this.nodeID = event.args.nodeID
    });
  },
  methods: {
    addProperty() {
      let keys = Object.keys(this.primitiveProperties);
      let lowerKeys = keys.map(key => key.toLocaleLowerCase());
      if (!lowerKeys.includes(this.tempPropName.toLocaleLowerCase())) {
        this.primitiveCalculated[this.tempPropName] = null
        this.primitiveProperties[this.tempPropName] = { value: null, type: this.options[0] };
        this.tempPropName = '';
      }
    },

    deleteProperty(propName) {
      this.$delete(this.primitiveProperties, propName);
    },

    onPropertyChanged(propName){
      const calcPropertyEvent = this.$root.eventSystem.createEvent(
            this.$root.guid,
            'PrimitivePropertyChanged'
          );
      calcPropertyEvent.id = "PrimitivePropertyChanged"
      calcPropertyEvent.args = [this.nodeID, propName]
      this.$root.eventSystem.publishEvent(calcPropertyEvent)
    },
  },
};
</script>

<style scoped></style>
