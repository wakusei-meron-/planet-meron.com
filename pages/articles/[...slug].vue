<template>
  <article class="article">
    <dl>
      <dt>{{ article.date }}</dt>
      <dd><h1 class="article-title">{{ article.title }}</h1></dd>
    </dl>

    <div v-if="!!article.image"><img :src="article.image" /></div>

    <div class="article-tags">
      <v-chip outlined v-for="tag in article.tags" :key="tag">
        #{{ tag }}
      </v-chip>
    </div>
    <div class="article-body">
      <ContentRenderer :value="article" />
    </div>
  </article>
</template>

<script setup>
const route = useRoute()

const { data: article } = await useAsyncData('article', () => {
  return queryContent("article").where({_id: { $contains: route.params.slug}}).findOne()
})
// import FontAwesomeIcon from "@nuxtjs/fontawesome";
//
// export default {
//   head() {
//     return {
//       title: this.title,
//       meta: [
//         { hid: "description", name: "description", content: this.description },
//         {
//           hid: "og:description",
//           property: "og:description",
//           content: this.description
//         },
//         { hid: "og:title", property: "og:title", content: this.title }
//       ]
//     };
//   },
//   async asyncData({ $content, params }) {
//     const article = await $content("articles", params.slug || "index").fetch();
//     return {
//       article,
//       title: article.title,
//       description: article.description
//     };
//   }
// };
</script>
<style lang="scss" scoped>
.article{
  &-title {
    font-size: 2.0rem;
    margin: 8px 0px 0px 16px;
  }

  &-tags {
    text-align: right;
  }

  &-body {
    margin: 24px 16px;
  }
}
</style>
