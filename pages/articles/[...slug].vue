<template>
  <article class="article">
    <dl>
      <dt class="article-date">{{ formattedDate }}</dt>
      <dd>
        <h1 class="article-title">{{ article?.title }}</h1>
      </dd>
    </dl>

    <div v-if="!!article?.image"><img :src="article?.image" /></div>

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
import { computed } from 'vue'
import { formatDate } from '~/utils/dateUtils'

const path = useRoute().path

const { data: article } = await useAsyncData(`articles-${path}`, () => {
  return queryCollection('articles').path(path).first()
})

const formattedDate = computed(() => {
  if (article.value?.date) {
    return formatDate(article.value.date)
  }
  return ''
})

useHead({
  title: article?.value?.title,
  meta: [
    { hid: "og:type", name: "og:type", content: "article" },
    {
      hid: "description",
      name: "description",
      content: article?.value?.description,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: article?.value?.title,
    },
    {
      hid: "og:url",
      property: "og:url",
      content: article?.value?.path,
    },
    {
      hid: "og:description",
      property: "og:description",
      content: article?.value?.description,
    },
  ],
});
</script>
<style lang="scss" scoped>
.article {
  &-date {
    margin-left: 8px;
  }
  &-title {
    font-size: 2rem;
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
