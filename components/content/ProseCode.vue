<script lang="ts">
import { defineComponent } from '#imports'
export default defineComponent({
  props: {
    code: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: null
    },
    filename: {
      type: String,
      default: null
    },
    highlights: {
      type: Array as () => number[],
      default: () => []
    }
  }
})
</script>

<template>
  <slot />
</template>

<style>
pre {
  background-color: #f6f8fa;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  border-radius: 6px;
  margin: 16px 0px;
}

code {
  background-color: #f6f8fa;
}

pre code .line {
  display: block;
  min-height: 1rem;
}
</style>
