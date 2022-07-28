<template functional>
  <div class="NoPrimitiveSelected">
    <span class="FontIcon name_tableAdd Icon"></span>
    <slot>
      Выберите примитив для отображения
    </slot>
  </div>
</template>

<script>
export default {
  name: 'NoPrimitiveSelected',
}
</script>

<style lang="scss" scoped>
.NoPrimitiveSelected {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  font-size: 16px;
  padding: 20px 10px;
  color: var(--text_secondary);
  user-select: none;

  .Icon {
    margin-bottom: 8px;
    width: 120px;
    height: 120px;
    font-size: 120px;
    color: var(--border_secondary);
  }
}
</style>
