<template>
  <span :key="status" :title="statuses[status].title" :style="{ color: statuses[status].color }">
    <i :class="statuses[status].class" />
  </span>
</template>

<script>
export default {
  name: 'StatusIcon',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    statuses: {
      error: {
        class: 'FontIcon name_error size_lg',
      },
      inProgress: {
        class: 'FontIcon name_loader size_lg',
        title: 'Загрузка данных',
      },
      successful: {
        class: 'Success',
        title: 'Новый элемент',
      },
    },
  }),
};
</script>

<style lang="scss" scoped>

.FontIcon {
  cursor: pointer;

  &.name_error {
    color: var(--danger);
  }

  &.name_loader {
    color: var(--border);
    animation-name: loader;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    transform-origin: 50% 50%;
    will-change: transform;
  } 
}

.Success {
  color: var(--success);
}

@keyframes loader {
	100% {
		transform: rotate(360deg);
	}
}
</style>