<template>
  <article class="article">
    <dl>
      <dt class="article-date">{{ article?.date }}</dt>
      <dd><h1 class="article-title">{{ article?.title }}</h1></dd>
    </dl>

    <div v-if="!!article.image"><img :src="article?.image" /></div>

    <div class="article-tags">
      <v-chip outlined v-for="tag in article?.tags" :key="tag">
        #{{ tag }}
      </v-chip>
    </div>
    <div class="article-body">
      <ContentRenderer :value="article" />
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: article } = await useAsyncData(route.path, () => {
  const normPath = route.path.replace(/\/$/, "")
  return queryContent("article").where({_path: { $contains: normPath}}).findOne()
})

// useContentHead(article)
useHead({
  title: article?._rawValue?.title,
  meta: [
    { hid: "og:type", name: "og:type", content: "article" },
    { hid: "description", name: "description", content: article?._rawValue?.description },
    { hid: "og:title", property: "og:title", content: article?._rawValue?.title },
    { hid: "og:url", property: "og:url", content: article?._rawValue?._path+"/" },
    {
      hid: "og:description",
      property: "og:description",
      content: article?._rawValue?.description
    },
  ]
})
</script>
<style lang="scss" scoped>
.article{
  &-date {
    margin-left: 8px;
  }
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
