<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <slot name="header"> Редактирвоание OTL запроса </slot>
          <button type="button" class="btn-close" @click="close">x</button>
        </header>

        <section class="modal-body">
          <div class="form-field">
            <div class="label-wrapper">
              <label>TTL</label>
            </div>
            <input id="ttl" type="number" class="input" v-model="tempValue.ttl" />
          </div>
          <div class="form-field">
            <div class="label-wrapper">
              <label>From</label>
            </div>
            <input id="datetime" type="datetime-local" class="input" v-model="tempValue.from" />
          </div>
          <div class="form-field">
            <div class="label-wrapper">
              <label>To</label>
            </div>
            <input id="datetime" type="datetime-local" class="input" v-model="tempValue.to" />
          </div>
          <div class="form-field">
            <div class="label-wrapper">
              <label>OTL</label>
            </div>
            <div class="grow-wrap">
              <textarea
                name="text"
                id="text"
                v-model="tempValue.otl"
                onInput="this.parentNode.dataset.replicatedValue = this.value"
              ></textarea>
            </div>
          </div>
        </section>

        <footer class="modal-footer">
          <button type="button" class="footer-btn" @click="save">Save</button>
          <button type="button" class="footer-btn" @click="close">Close</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'OTLModalWindow',
  props: {
    otlData: Object,
  },
  data() {
    return {
      tempValue: {
        otl: '',
        from: null,
        to: null,
        ttl: null,
      },
    };
  },
  mounted() {
    this.tempValue = { ...this.otlData };
  },
  methods: {
    close() {
      this.$emit('close');
      this.clearTempValue();
    },
    save() {
      const requestData = {
        from: this.tempValue.from,
        to: this.tempValue.to,
        ttl: this.tempValue.ttl,
        otl: this.tempValue.otl.trim(),
      };
      this.$emit('savedOTL', requestData);
      this.close();
    },
    clearTempValue() {
      this.tempValue = {
        otl: '',
        from: null,
        to: null,
        ttl: null,
      };
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  height: 90vh;
  width: 90vh;
  display: flex;
  flex-direction: column;
  z-index: 30;
  position: relative;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  justify-content: space-between;
}

.modal-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 5px;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #757575;
  background: transparent;
}
.btn-close:hover {
  color: #2196f3;
}

.footer-btn {
  padding: 5px;
  width: 80px;
  margin: 2px 5px;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.grow-wrap {
  display: grid;
}
.grow-wrap::after {
  content: attr(data-replicated-value) ' ';
  white-space: pre-wrap;
  visibility: hidden;
}
.grow-wrap > textarea {
  resize: none;
  overflow: hidden;
}
.grow-wrap > textarea,
.grow-wrap::after {
  padding: 0.5rem;
  border: 1px solid rgb(199, 208, 217);
  font: inherit;
  grid-area: 1 / 1 / 2 / 2;
}

.input {
  padding: 0.5rem;
  border: 1px solid rgb(199, 208, 217);
  width: 200px;
}
.label-wrapper {
  padding: 0.2rem;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
}
.form-field {
  margin-bottom: 10px;
}
</style>
