<template>
  <div class="prose-img-wrapper">
    <img
      :src="refinedSrc"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      loading="lazy"
      class="prose-img"
      @click="openModal"
    />
    
    <v-dialog
      v-model="showModal"
      max-width="90vw"
      max-height="90vh"
      content-class="image-modal-dialog"
    >
      <v-card class="image-modal-card">
        <v-card-actions class="image-modal-actions">
          <v-spacer></v-spacer>
          <v-btn
            icon
            variant="text"
            @click="showModal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        
        <v-card-text class="image-modal-content">
          <img
            :src="refinedSrc"
            :alt="props.alt"
            class="modal-img"
            @click.stop
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

const showModal = ref(false)

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})

const openModal = () => {
  showModal.value = true
}
</script>

<style lang="scss" scoped>
.prose-img-wrapper {
  display: inline-block;
  width: 100%;
  
  .prose-img {
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.9;
    }
  }
}

:deep(.image-modal-dialog) {
  background-color: rgba(0, 0, 0, 0.9);
}

.image-modal-card {
  background-color: transparent !important;
  box-shadow: none !important;
  
  .image-modal-actions {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    
    .v-btn {
      color: white;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
  
  .image-modal-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    
    .modal-img {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
    }
  }
}
</style>