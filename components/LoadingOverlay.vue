<template>
  <v-overlay
    :model-value="loading"
    persistent
    class="loading-overlay"
  >
    <div class="loading-content">
      <v-progress-circular
        indeterminate
        size="64"
        width="4"
        color="primary"
      />
      <div class="loading-text mt-4">{{ text }}</div>
    </div>
  </v-overlay>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '読み込み中...'
  }
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/colors' as *;

.loading-overlay {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .loading-text {
    color: $white;
    font-size: 1.1rem;
    font-weight: 500;
  }
}

// Vuetifyのオーバーレイスタイルを強制的に上書き
:deep(.v-overlay__content) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>