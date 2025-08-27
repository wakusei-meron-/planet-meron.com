<template>
  <pre :class="$props.class"><slot /></pre>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  code: {
    type: String,
    default: ""
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
    type: Array,
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
});
</script>

<style>
pre {
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}
</style>