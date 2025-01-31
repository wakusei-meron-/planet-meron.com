<script setup lang="ts">
  const { data: profile } = await useAsyncData('profile', () => {
    return queryCollection('profile').first()
  })
</script>
<template>
  <article class="profile">
    <ContentRenderer :value="profile" />
  </article>
</template>

<style scoped lang="scss"></style>
