<template>
  <div class="FullValueView">
    <div class="Wrapper">
      <header class="Header">
        <base-heading theme="theme_subheaderSmall" >
          <input
            :value="valueData.prop"
            class="PropName"
            readonly
            type="text"
            tabindex="-1"
          />
        </base-heading>
      </header>
      <section class="SectionButtonBack" @click="$emit('close')">
        <span class="FontIcon name_chevronBigDown rotate_90 size_lg"></span>
        <span class="ButtonBackText">Назад</span>
      </section>
      <section class="BodyItem" v-text="valueData.value"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullValueView',
  props: { valueData: Object },
};
</script>

<style lang="scss" scoped>
.FullValueView {
  display: flex;
  min-height: 100%;
  color: var(--text_main);
  font-family: 'Proxima Nova';

  .Wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--background_main);
    position: relative;
    z-index: 30;
  }

  .Header {
    border-bottom: 1px solid var(--border_secondary);
    padding: 10px;

    .PropName {
      width: 100%;
      padding-bottom: 4px;
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
    margin-top: 10px;
  }

  .ButtonBackText {
    margin-left: 6px;
  }

  .BodyItem {
    margin: 10px;
    height: 100%;
    background-color: var(--background_secondary);
    overflow: auto;
    padding: 10px;
    white-space: pre;
    border-radius: 8px;
  }
}
</style>
