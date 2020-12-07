<template>
  <article class="article">
    <dl>
      <dd>{{ article.date }}</dd>
    </dl>
    <h1 class="article-title">{{ article.title }}</h1>
    <div v-if="!!article.image"><img :src="article.image" /></div>

    <div class="article-tags">
      <v-chip outlined v-for="tag in article.tags" :key="tag">
        #{{ tag }}
      </v-chip>
    </div>

    <nuxt-content :document="article" />
  </article>
</template>

<script>
export default {
  head() {
    return {
      title: this.title,
      meta: [
        { hid: "description", name: "description", content: this.description },
        { hid: 'og:description', property: 'og:description', content: this.description }
      ]
    };
  },
  async asyncData({ $content, params }) {
    const article = await $content("articles", params.slug || "index").fetch();
    return {
      article,
      title: article.title,
      description: article.description
    };
  }
};
</script>
<style lang="scss" scoped>
.article {
  &-title {
    padding-bottom: 12px;
    font-size: 2rem;
  }

  &-tags {
    text-align: right;
    padding-bottom: 18px;
  }
}
</style>
