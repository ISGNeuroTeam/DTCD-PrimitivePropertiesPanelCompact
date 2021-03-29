<template>
  <div class="primitive-properties-panel-container">
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
        <input placeholder="Enter value" v-model="propObj.value" />
        <button @click="deleteProperty(propName)">Delete</button>
      </div>
      <input placeholder="Enter new prop" v-model="newPropName" />
      <button @click="addProperty">Add</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrimitivePropertiesPanel',
  data() {
    return {
      primitiveProperties: null,
      options: ['expression', 'OTL'],
      newPropName: '',
    };
  },
  mounted() {
    this.$root.eventSystem.subscribeEventNameByCallback('PrimitiveClicked', event => {
      if (event.args.properties) {
        Object.values(event.args.properties).forEach(prop => {
          if (!prop.type) prop.type = this.options[0];
        });
      } else event.args.properties = {};
      this.primitiveProperties = event.args.properties;
    });
  },
  methods: {
    addProperty() {
      let keys = Object.keys(this.primitiveProperties);
      let lowerKeys = keys.map(key => key.toLocaleLowerCase());
      if (!lowerKeys.includes(this.newPropName.toLocaleLowerCase())) {
        this.primitiveProperties[this.newPropName] = { value: null, type: this.options[0] };
        this.newPropName = '';
      }
    },
    deleteProperty(propName) {
      this.$delete(this.primitiveProperties, propName);
    },
  },
};
</script>

<style scoped></style>
