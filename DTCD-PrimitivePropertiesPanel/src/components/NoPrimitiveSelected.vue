<template functional>
  <div class="NoPrimitiveSelected">
    <svg class="Icon" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M81.25 62.5001V131.25C75.021 131.25 47.6271 131.25 31.2447 131.25C24.3412 131.25 18.75 125.654 18.75 118.75V31.25C18.75 24.3464 24.3464 18.75 31.25 18.75L118.75 18.75C125.654 18.75 131.25 24.3465 131.25 31.25V62.5001H81.25ZM68.75 62.5001H31.25V87.5001H68.75V62.5001ZM68.75 118.75V100H31.25V118.75H68.75ZM81.25 31.2501V50.0001H118.75V31.2501H81.25ZM68.75 31.2501H31.25V50.0001H68.75V31.2501Z" fill="#EBEBF3"/>
      <path d="M118.75 131.25V112.5H100V100H118.75V81.2501H131.25V100H150V112.5H131.25V131.25H118.75Z" fill="#EBEBF3"/>
    </svg>
    <span>Выбранный объект еще не имеет свойств и портов.
Добавьте свойство или порт оно отобразится в этом списке.</span>
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
  font-size: 17px;
  padding: 20px 10px;
  color: var(--text_secondary);

  .Icon {
    margin-bottom: 8px;
    width: 150px;
    height: 150px;
  }
}
</style>