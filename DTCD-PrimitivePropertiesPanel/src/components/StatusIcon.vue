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
        class: 'FontIcon name_helpCircle',
        color: '#EF5350',
        title: 'Property calculation error',
      },
      inProgress: {
        class: 'FontIcon name_alarm',
        color: '#2196F3',
        title: 'Property is calcutating',
      },
    },
  }),
};
</script>
