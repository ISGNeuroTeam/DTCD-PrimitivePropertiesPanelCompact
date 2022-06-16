<template>
  <div class="ElementSettings">
    <header class="ElementSettingsHeader">
      <base-heading theme="theme_subheaderSmall" >
        <input
          :value="propData.propName"
          class="PropName"
          readonly
          type="text"
          tabindex="-1"
        />
      </base-heading>
    </header>

    <div class="SectionButtonBack" @click="close">
      <span class="FontIcon name_chevronBigDown rotate_90 size_lg"></span>
      <span class="ButtonBackText">Назад</span>
    </div>

    <section class="ElementSettingsBody">
      <div class="BodyRow">
        <div class="RowItem">
          <base-select
            :value="propType"
            class="FormField"
            label="Тип запроса"
            @input="propType = $event.target.value"
          >
            <div
              v-for="type in propertyTypes"
              :key="type.name"
              slot="item"
              :value="type.name"
              v-text="type.title"
            />
          </base-select>
        </div>
      </div>

      <div v-if="propType === 'OTL'" class="BodyRow Col-3">
        <div class="RowItem">
          <base-input
            :value="paramsOTL.cache_ttl"
            class="FormField"
            type="number"
            label="TTL"
            @input="paramsOTL.cache_ttl = $event.target.value"
          />
        </div>
        <div class="RowItem">
          <date-time-picker
            :value="paramsOTL.tws"
            class="FormField DateTimePicker"
            label="TWS"
            @input="paramsOTL.tws = $event.target.value"
          />
        </div>
        <div class="RowItem">
          <date-time-picker
            :value="paramsOTL.twf"
            class="FormField DateTimePicker"
            label="TWF"
            visible="false"
            @input="paramsOTL.twf = $event.target.value"
          />
        </div>
      </div>

      <div class="BodyRow">
        <div class="RowItem">
          <base-textarea
            :value="expression"
            class="FormField"
            label="Запрос"
            placeholder="Введите запрос"
            @input="expression = $event.target.value"
          />
        </div>
      </div>
    </section>

    <footer class="ElementSettingsFooter">
      <base-icon-button
        v-if="propData.propType === 'property'"
        class="DeleteBtn"
        size="big"
        theme="theme_red"
        @click="deleteElement"
      >
        <span class="FontIcon name_trashFull size_lg"></span>
      </base-icon-button>
      <base-button
        size="big"
        theme="theme_secondary"
        @click="close"
      >Отменить</base-button>
      <base-button
        size="big"
        @click="save"
      >Сохранить</base-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ElementSettings',
  props: {
    propData: Object,
  },
  data() {
    return {
      propType: '',
      expression: '',
      paramsOTL: {
        type: 'OTL',
        tws: 0,
        twf: 0,
        cache_ttl: 60,
        original_otl: '',
      },
      propertyTypes: [
        { name: 'expression', title: 'Expression' },
        { name: 'OTL', title: 'OTL' },
      ],
    };
  },
  mounted() {
    const { type, expression } = this.propData.data;
    const dateNow = Number(new Date());

    this.propType = type;
    this.expression = expression;
    this.paramsOTL.tws = dateNow;
    this.paramsOTL.twf = dateNow;

    if (type === 'datasource' && typeof expression === 'object') {
      if (expression.type === 'OTL') {
        const { tws, twf, cache_ttl, original_otl } = expression;
        this.propType = 'OTL';
        this.expression = original_otl;
        this.paramsOTL.tws = tws * 1000;
        this.paramsOTL.twf = twf * 1000;
        this.paramsOTL.cache_ttl = cache_ttl;
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },

    save() {
      const { propName, propType } = this.propData;

      const type = this.propType === 'expression'
        ? 'expression'
        : 'datasource';

      this.paramsOTL.tws = Math.floor(this.paramsOTL.tws / 1000);
      this.paramsOTL.twf = Math.floor(this.paramsOTL.twf / 1000);
      this.paramsOTL.original_otl = this.expression.trim();

      const expression = this.propType === 'expression'
        ? this.expression
        : { ...this.paramsOTL };

      this.$emit('save', {
        propName,
        propType,
        data: { type, expression }
      });

      this.close();
    },

    deleteElement() {
      const { propName, propType } = this.propData;
      this.$emit('delete', { propName, propType });
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.ElementSettings {
  display: flex;
  flex-direction: column;;
  min-height: 100%;
  color: var(--text_main);
  font-family: 'Proxima Nova';

  .ElementSettingsHeader {
    padding: 10px;
    border-bottom: 1px solid var(--border_secondary);

    .PropName {
      width: 100%;
      padding-right: 20px;
      color: var(--title);
      font-family: 'Proxima Nova';
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      border: none;
      outline: none;
      background-color: var(--background_main);
    }
  }

  .SectionButtonBack {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 700;
    padding: 10px;
    cursor: pointer;

    .ButtonBackText {
      margin-left: 6px;
    }
  }

  .ElementSettingsBody {
    flex: 1 0;
    padding: 10px;
    overflow: auto;

    .BodyRow {
      display: grid;
      gap: 10px;
      margin: 10px 0;

      &.Col-2 {
        grid-template-columns: 1fr 1fr;
      }

      &.Col-3 {
        grid-template-columns: 1fr 1fr 1fr;
      }

      .FormField {
        width: 100%;

        &.DateTimePicker {
          z-index: 1;
        }
      }
    }
  }

  .ElementSettingsFooter {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px;

    .DeleteBtn {
      margin-right: auto;

      .FontIcon {
        color: var(--danger);
      }
    }
  }
}
</style>
