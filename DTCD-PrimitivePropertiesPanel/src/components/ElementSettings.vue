<template>
  <transition name="modal-fade">
    <div class="ElementSettings">
      <div class="SettingsBackdrop">
        <header class="ElementSettingsHeader">
          <base-heading theme="theme_subheaderSmall" >
            <h1>Название свойства</h1> 
          </base-heading>
        </header>

        <section class="ElementSettingsBody">
          <div 
            @click="close" 
            type="button" 
            class="SectionButtonBack"
            >
            <span class="FontIcon name_chevronBigDown rotate_90 size_lg"></span>
            <span class="ButtonBackText">Назад</span>
          </div>

          <div class="BodyItem">
            <base-input 
              placeholder="Введите название"
              class="FormField" 
              label="Название"
            >
            </base-input>
            <base-select 
              class="FormField" 
              label="Тип запроса"
            >
              <div slot="item" value="Expression">Expression</div>
              <div slot="item" value="OTL">OTL</div>
            </base-select>
          </div>
          <div class="BodyItem">
            <base-textarea
              label="Запрос"
              placeholder="Введите запрос"
              class="TextareaWrapper"
              name="text"
              id="text"
              v-model="tempValue.original_otl"
              onInput="this.parentNode.dataset.replicatedValue = this.value"
            >
            </base-textarea>
          </div>
          <base-button 
            theme="theme_red" 
            size="big"
            class="ButtonDelete"
          >Удалить свойство
          </base-button>
        </section>

        <footer class="ElementSettingsFooter">
          <base-button 
            size="big" 
            theme="theme_secondary" 
            @click="close" 
            type="button" 
            class="FooterButton"
          >Отменить
          </base-button>
          <base-button 
            size="big" 
            @click="save" 
            type="button" 
            class="FooterButton"
          >Сохранить
          </base-button>
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
  name: 'ElementSettings',
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

<style lang="scss" scoped>
.ElementSettings {
  display: flex;
  color: var(--text_main);
  min-height: 100%;

  .SettingsBackdrop {
    background: var(--background_main);
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: 30;
    position: relative;
  }

  .ElementSettingsHeader {
    border-bottom: 1px solid var(--border_secondary);
  }

  .ElementSettingsHeader,
  .ElementSettingsFooter {
    padding: 10px;
    display: flex;
  }

  .ElementSettingsBody {
    padding: 10px;
  }

  .SectionButtonBack {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 700;
    padding: 10px 0;
    cursor: pointer;
  }

  .ButtonBackText {
    margin-left: 6px;
  }

  .BodyItem {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }

  .FormField {
    width: 50%;

    &:first-child {
      margin-right: 20px;
    }
  }

  .TextareaWrapper {
    width: 100%;
    padding-bottom: 30px;
  }

  .ButtonDelete {
    width: 50%;
  }

  .ElementSettingsFooter {
    justify-content: flex-end;
    margin-top: auto;
  }

  .FooterButton {
    width: 30%;
  }

  .FooterButton:first-child {
    padding-right: 8px;
  }
}
</style>