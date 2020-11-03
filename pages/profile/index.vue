<template>
  <article class="profile">
    <nuxt-content :document="content" class="profile-content" />
  </article>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  async asyncData({ $content, params }) {
    const content = await $content("info", "profile").fetch();
    return { content };
  }
});
</script>

<style scoped lang="scss"></style>
