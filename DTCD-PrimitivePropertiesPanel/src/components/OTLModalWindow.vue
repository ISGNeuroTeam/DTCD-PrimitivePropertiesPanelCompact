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
            <input id="ttl" type="number" class="input" v-model="tempValue.cache_ttl" />
          </div>
          <div class="label-wrapper">
            <label>Time range</label>
          </div>
          <DatePicker v-model="range" mode="dateTime" :masks="masks" is-range>
            <template v-slot="{ inputValue, inputEvents }">
              <div class="template1">
                <div class="input-container1">
                  <svg
                    class="calendar-icon1"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <input :value="inputValue.start" v-on="inputEvents.start" class="input-field1" />
                </div>
                <span class="flex-shrink-0 m-2">
                  <svg style="strok: black" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <div class="input-container1">
                  <svg
                    class="calendar-icon1"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <input :value="inputValue.end" v-on="inputEvents.end" class="input-field1" />
                </div>
              </div>
            </template>
          </DatePicker>
          <!-- <div class="form-field">
            <div class="label-wrapper">
              <label>From</label>
            </div>
            <input ref="datetimeFrom" type="datetime-local" class="input" v-model="tempValue.tws" />
          </div>
          <div class="form-field">
            <div class="label-wrapper">
              <label>To</label>
            </div>
            <input ref="datetimeTo" type="datetime-local" class="input" v-model="tempValue.twf" />
          </div> -->
          <div class="form-field">
            <div class="label-wrapper">
              <label>OTL</label>
            </div>
            <div class="grow-wrap">
              <textarea
                name="text"
                id="text"
                v-model="tempValue.original_otl"
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
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
export default {
  components: {
    DatePicker,
  },
  name: 'OTLModalWindow',
  props: {
    otlData: Object,
  },
  data() {
    return {
      tempValue: {
        type: 'OTL',
        original_otl: '',
        tws: null,
        twf: null,
        cache_ttl: null,
      },
      range: {
        start: new Date(),
        end: new Date(),
      },
      masks: {
        input: 'YYYY-MM-DD h:mm A',
      },
    };
  },
  mounted() {
    this.tempValue = {
      type: 'OTL',
      ...this.otlData,
    };
    this.range = {
      start: new Date(this.tempValue.tws * 1000),
      end: new Date(this.tempValue.twf * 1000),
    };
  },
  methods: {
    close() {
      this.$emit('close');
      this.clearTempValue();
    },
    save() {
      this.tempValue.original_otl.trim();
      this.tempValue.tws = Date.parse(this.range.end) / 1000;
      this.tempValue.twf = Date.parse(this.range.start) / 1000;
      console.log(this.tempValue);
      this.$emit('savedOTL', this.tempValue);
      this.close();
    },
    clearTempValue() {
      this.tempValue = {
        type: 'OTL',
        original_otl: '',
        tws: new Date(),
        twf: new Date(),
        cache_ttl: null,
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
.template1 {
  display: flex;
}
.input-container1 {
  position: relative;
  margin-right: 10px;
}
.calendar-icon1 {
  position: absolute;
  width: 1rem;
  margin: 8px;
}
.input-field1 {
  background-color: #f7fafc;
  border-width: 1px;
  border-radius: 5px;
  padding: 8px 0 8px 25px;
  font-size: 100%;
  border: 1px solid #e2e8f0;
}
</style>
