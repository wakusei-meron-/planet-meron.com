<script lang="ts" setup>
const countPerPage = 10

const route = useRoute()
let page = computed({
  get(){
    return Number(route.query.page || 1)
  },
  set(val: any){
    changeQuery("page", val)
  },
})

const router = useRouter()
const changeQuery = (key: string, val: number) => {
  router.push({
    query: {...route.query, [key]: val}
  })
}

let offset = computed(() => {
  return (page.value - 1) * countPerPage
})

const { data: articlesCountData } = await useAsyncData('allArticles', () => {
  return queryCollection('articles').count()
})
const articlesCount = articlesCountData?.value

console.log("articlesCount", articlesCount)

let { data: articles, refresh } = await useAsyncData(`articles-${offset}`, () => {
  return queryCollection('articles')
    .select("id", "path", "title", "date", "tags")
    .order("date", "DESC")
    .limit(countPerPage)
    .skip(offset.value)
    .all()
})

watch(page, () => {
  refresh()
})
</script>

<template>
  <div class="article-card-container">
    <div v-for="a in articles" :key="a.id" class="article-card">
      <article-card v-bind:article="a"></article-card>
    </div>
    <div class="text-center">
      <v-pagination :length="Math.ceil((articlesCount ?? 0) / countPerPage)" v-model="page"></v-pagination>
    </div>
  </div>
</template>


<style lang="scss">
.article-card {
  padding: 8px;
  margin: 8px;
}
</style>
