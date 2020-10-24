<template>
  <article>
    <h1>{{articles.title}}</h1>
    <dl>
      <dt>date</dt>
      <dd>{{articles.date}}</dd>
    </dl>
    <div><img :src="articles.image" /></div>
    <div v-for="tag in articles.tags" :key="tag">{{tag}}</div>

    <nuxt-content :document="articles" />
  </article>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const articles = await $content('articles', params.slug || 'index').fetch()
    return { articles }
  }
}
</script>
