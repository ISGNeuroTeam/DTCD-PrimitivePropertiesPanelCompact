<template>
  <div class="ElementSettings">
    <header class="ElementSettingsHeader">
      <base-heading theme="theme_subheaderSmall">
        <input :value="propData.propName" class="PropName" readonly type="text" tabindex="-1" />
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
            @input="changePropType($event)"
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

      <div v-if="propType === 'expression'" class="BodyRow">
        <div class="RowItem">
          <base-select
            ref="inputTypeSelector"
            :value="component"
            class="FormField"
            label="Тип поля ввода"
            @input="changeInputType($event)"
          >
            <div
              v-for="type in inputTypes"
              :key="type.input"
              slot="item"
              :value="type.input"
              v-text="type.input"
            />
          </base-select>
        </div>
      </div>

      <div v-show="propType === 'expression'" class="BodyRow">
        <div ref="inputElement" class="RowItem"></div>
      </div>

      <span v-if="loaderVisible" class="ValueData progress">
        <StatusIcon class="StatusIcon" :status="'inProgress'" />
        Загрузка данных
      </span>

      <span v-if="datasourceError" class="ValueData error">
        <StatusIcon class="StatusIcon" :status="'error'" />
        Ошибка при выполнении запроса
      </span>

      <div v-if="propType === 'OTL'">
        <div class="BodyRow Col-3">
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
      <base-button size="big" theme="theme_secondary" @click="close">Отменить</base-button>
      <base-button size="big" @click="save">Сохранить</base-button>
    </footer>
  </div>
</template>

<script>
import StatusIcon from '@/components/StatusIcon';

export default {
  name: 'ElementSettings',
  props: {
    propData: Object,
  },
  components: {
    StatusIcon,
  },
  data({ $root }) {
    return {
      datasourceSystem: $root.dataSourceSystem,
      propType: 'expression',
      expression: '',
      component: '',
      componentValues: [],
      inputDataType: 'const',
      inputDataTypes: ['const', 'datasource'],
      loaderVisible: false,
      datasourceError: false,
      columnName: '',
      requestString: '',
      element: null,
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
      inputTypes: [
        { input: 'textarea', componentName: 'base-textarea' },
        { input: 'select', componentName: 'base-select' },
        { input: 'switch', componentName: 'base-switch' },
      ],
    };
  },
  async mounted() {
    const { type, expression } = this.propData.data;
    const dateNow = Number(new Date());

    this.propType = type;
    this.expression = expression;
    this.paramsOTL.tws = dateNow;
    this.paramsOTL.twf = dateNow;

    const {
      component = 'textarea',
      type: inputDataType = 'const',
      values = [],
      datasource = {},
      columnName = '',
    } = this.propData.data.input ? this.propData.data.input : {};

    const { original_otl = '' } = datasource;

    this.component = component;
    this.inputDataType = inputDataType;
    this.componentValues = values;
    this.requestString = original_otl;
    this.columnName = columnName;

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

      const type = this.propType === 'expression' ? 'expression' : 'datasource';

      this.paramsOTL.tws = Math.floor(this.paramsOTL.tws / 1000);
      this.paramsOTL.twf = Math.floor(this.paramsOTL.twf / 1000);
      this.paramsOTL.original_otl = this.expression.trim();

      const expression = this.propType === 'expression' ? this.expression : { ...this.paramsOTL };
      let input = { component: this.component };

      if (this.component === 'select') {
        if (this.inputDataType === 'datasource')
          input = {
            ...input,
            type: this.inputDataType,
            values: this.componentValues,
            columnName: this.columnName,
            datasource: { original_otl: this.requestString },
          };
        else {
          input = {
            ...input,
            type: this.inputDataType,
            values: this.componentValues,
          };
        }
      }

      this.$emit('save', {
        propName,
        propType,
        data: { type, expression, input },
      });

      this.close();
    },

    deleteElement() {
      const { propName, propType } = this.propData;
      this.$emit('delete', { propName, propType });
      this.close();
    },

    changePropType(event) {
      this.propType = event.target.value;
      if (this.propType === 'expression') {
        this.$nextTick(() => {
          this.renderElement();
        });
      }
    },
    changeInputType(event) {
      this.component = event.target.value;
      this.renderElement();
    },

    resetValues() {
      this.componentValues = [];
      this.columnName = '';
      this.requestString = '';
      this.expression = '';
    },

    async renderElement() {
      this.datasourceError = false;
      this.$refs['inputElement'].innerHTML = '';

      this.element = document.createElement(`base-${this.component}`);
      this.element.setAttribute('label', 'Значение');

      switch (this.component) {
        case 'textarea':
          this.element.value = this.expression;
          this.element.addEventListener('change', e => {
            this.expression = e.target.value;
          });
          this.$refs['inputElement'].appendChild(this.element);
          break;

        case 'select':
          this.element.value = this.expression.replace(/(^'|'$)/g, '');

          const typeSelector = document.createElement('base-select');

          this.inputDataTypes.forEach(type => {
            const typeOption = this._createOption(type, type);
            typeSelector.appendChild(typeOption);
          });

          typeSelector.value = this.inputDataType;
          typeSelector.setAttribute('label', 'Тип данных');

          this.$refs['inputElement'].appendChild(typeSelector);

          typeSelector.addEventListener('input', e => {
            this.resetValues();
            this.inputDataType = e.target.value;
            this.renderElement();
          });

          if (this.inputDataType === 'const') {
            const valueInput = document.createElement('base-input');
            valueInput.value = this.componentValues.join(',');
            valueInput.setAttribute('label', 'Значения в списке (через ,)');
            valueInput.addEventListener('change', e => {
              const inputValues = e.target.value.split(',');
              this.componentValues = inputValues;
              this.element.innerHTML = '';
              this.element.setAttribute('label', 'Значение');
              inputValues.forEach(value => {
                const valueOption = this._createOption(value, value);
                this.element.appendChild(valueOption);
              });
            });

            this.$refs['inputElement'].appendChild(valueInput);

            this.componentValues.forEach(value => {
              const valueOption = this._createOption(value, value);
              this.element.appendChild(valueOption);
            });
            this.$refs['inputElement'].appendChild(this.element);
          } else if (this.inputDataType === 'datasource') {
            const requestAreaElement = document.createElement('base-textarea');
            requestAreaElement.label = 'Текст запроса';
            requestAreaElement.value = this.requestString;
            requestAreaElement.addEventListener('change', e => {
              this.requestString = e.target.value;
            });
            this.$refs['inputElement'].appendChild(requestAreaElement);

            const playButton = document.createElement('base-button');
            playButton.innerHTML = 'Запустить';
            playButton.addEventListener('click', async () => {
              this.columnName = '';
              this.loaderVisible = true;
              try {
                await this._runDatasource();
              } catch (err) {
                this.datasourceError = true;
              } finally {
                this.loaderVisible = false;
                this.renderElement();
              }
            });
            this.$refs['inputElement'].appendChild(playButton);

            if (this.requestString !== '') {
              if (this.componentValues.length < 1) {
                try {
                  this.loaderVisible = true;
                  await this._runDatasource();
                  this._fillColumns();
                } catch (err) {
                  this.datasourceError = true;
                } finally {
                  this.loaderVisible = false;
                }
              } else this._fillColumns();
            }
          }

          this.element.value = this.expression.replace(/(^'|'$)/g, '');

          this.element.addEventListener('change', e => {
            this.expression = `'${e.target.value}'`;
          });
          break;

        case 'switch':
          this.element.setAttribute('label', 'Значение');
          this.element.value = this.expression === 'true' ? true : false;
          this.element.addEventListener('change', e => {
            this.expression = `${e.target.value}`;
          });
          this.$refs['inputElement'].appendChild(this.element);
          break;
        default:
          break;
      }
    },

    async _runDatasource() {
      let result = await this.datasourceSystem.oneShotRun('otl', {
        queryString: this.requestString,
      });
      this.componentValues = result;
    },

    _fillColumns() {
      try {
        const columnSelect = document.createElement(`base-select`);
        columnSelect.setAttribute('label', 'Имя колонки');

        Object.keys(this.componentValues[0]).forEach(columnName => {
          const columnOption = this._createOption(columnName, columnName);
          columnSelect.appendChild(columnOption);
        });

        columnSelect.addEventListener('change', () => {
          this.element.value = '';
          this.element.innerHTML = '';
          this.element.setAttribute('label', 'Значение');
          this.componentValues.forEach(value => {
            const valueOption = this._createOption(
              value[columnSelect.value].toString(),
              value[columnSelect.value].toString()
            );
            this.element.appendChild(valueOption);
          });
          this.$refs['inputElement'].appendChild(this.element);
        });

        this.loaderVisible = false;

        this.$refs['inputElement'].appendChild(columnSelect);

        if (this.columnName) {
          columnSelect.value = this.columnName;
          this.$refs['inputElement'].appendChild(this.element);
        }
      } catch (err) {
        console.log(err);
      }
    },

    _createOption(value, text) {
      const option = document.createElement('div');
      option.setAttribute('slot', 'item');
      option.setAttribute('value', value);
      option.innerHTML = text;
      return option;
    },
  },
};
</script>

<style lang="scss" scoped>
.ElementSettings {
  display: flex;
  flex-direction: column;
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
