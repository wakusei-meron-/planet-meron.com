<template>
  <div class="loading-spinner">
    <v-progress-circular
      indeterminate
      color="primary"
      :size="size"
      :width="width"
    />
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 64
  },
  width: {
    type: Number,
    default: 4
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/colors' as *;

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  
  .loading-text {
    margin-top: 16px;
    color: $text-secondary;
    font-size: 0.875rem;
  }
}
</style>