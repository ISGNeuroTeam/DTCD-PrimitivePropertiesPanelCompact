<template>
  <span class="FontIcon" :class="statuses[status]"></span>
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
      error: 'name_error size_lg',
      inProgress: 'name_loader size_lg',
    },
  }),
};
</script>

<style lang="scss" scoped>
.FontIcon {

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

@keyframes loader {
  100% {
    transform: rotate(360deg);
  }
}
</style>
