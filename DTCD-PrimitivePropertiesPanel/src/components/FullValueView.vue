<template>
  <transition name="modal-fade">
    <div class="FullValueView">
      <div class="Wrapper">
        <header class="Header">
          <base-heading theme="theme_subheaderSmall" >
            <h1>Название свойства или порта</h1> 
          </base-heading>
        </header>

        <section 
          @click="close" 
          type="button" class="SectionButtonBack"
          >
          <span class="FontIcon name_chevronBigDown rotate_90 size_lg"></span>
          <span class="ButtonBackText">Назад</span>
        </section>

        <section class="BodyItem">
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam amet perspiciatis, quibusdam ut alias sapiente quis fugiat dicta modi optio rerum id enim consequuntur asperiores accusantium culpa a veritatis maiores!Lorem Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto doloremque id eligendi alias debitis delectus!</p>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'FullValueView',
  props: {
    otlData: Object,
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
  },
};
</script>

<style lang="scss" scoped>

.FullValueView {
  display: flex;
  color: var(--text_main);
  font-family: 'Proxima Nova';
  height: 100%;

  .Wrapper {
    background: var(--background_main);
    display: flex;
    flex-direction: column;
    z-index: 30;
    position: relative;
  }

  .Header {
    border-bottom: 1px solid var(--border_secondary);
    padding: 10px;
  }

  .SectionButtonBack {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: 700;
    padding: 10px;
    cursor: pointer;
    margin-top: 10px;
  }

  .ButtonBackText {
    margin-left: 6px;
  }

  .BodyItem {
    margin: 10px;
    height: 100%;
    align-items: center;
    background-color: var(--background_secondary);
    overflow: auto;
    padding: 10px;
    border-radius: 8px;
  }
}
</style>