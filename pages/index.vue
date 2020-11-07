<template>
  <div class="article-card-container">
    <div v-for="a in articles" :key="a.slug">
      <article-card v-bind:article="a"></article-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ArticleCard from "../components/ArticleCard.vue";

export default Vue.extend({
  components: {
    ArticleCard
  },
  async asyncData({ $content, params }) {
    const query = await $content("articles")
      .sortBy("date", "desc")
      .limit(15);
    const articles = await query.fetch();
    return { articles };
  }
});
</script>

<style></style>
