<template functional>
  <div class="no-primitive-selected">
    <span>No primitive selected</span>
    <i class="fas fa-project-diagram icon"/>
  </div>
</template>

<script>
export default {
  name: 'NoPrimitiveSelected',
}
</script>

<style lang="scss" scoped>
.no-primitive-selected {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  font-weight: 300;

  .icon {
    color: #959595;
    font-size: 25px;
    margin-top: 15px;
  }
}
</style>
