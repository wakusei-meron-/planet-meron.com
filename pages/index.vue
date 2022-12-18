<template>
  <div class="article-card-container">
    <div v-for="a in articles" :key="a._id" class="article-card">
      <article-card v-bind:article="a"></article-card>
    </div>
<!--    <div class="text-center">-->
<!--      <v-pagination-->
<!--        v-model="page"-->
<!--        :length="length"-->
<!--        @input="handleChangePage"-->
<!--      ></v-pagination>-->
<!--    </div>-->
  </div>
</template>

<script lang="ts" setup>
const { data: articles } = await useAsyncData('equal', () => {
  return queryContent('articles').sort({date: -1}).find()
})
// import {defineComponent} from "vue";
// import ArticleCard from "../components/ArticleCard.vue";
//
// export default defineComponent({
//   components: {
//     ArticleCard
//   },
//   async asyncData({ $content, query, redirect }) {
//     // if (!query.page) {
//     //   redirect(301, `/`, {
//     //     page: "1",
//     //   })
//     //   return
//     // }
//     // console.log(query)
//     // const page = Number(query.page) || 1
//     //
//     // const perPage = 10
//     //
//     // const total = (await $content("articles")
//     //   .where({ draft: { $ne: true } })
//     //   .fetch()).length
//     // const length = Math.ceil(total / perPage)
//
//
//     const q = await $content("articles")
//       .sortBy("date", "desc")
//       .where({ draft: { $ne: true } })
//       // .skip(perPage * (page -1))
//       // .limit(perPage);
//     const articles = await q.fetch();
//     return { articles };
//   },
//   watchQuery: ['page'],
//   methods: {
//     changeQuery(params: object) {
//       this.$router.push({
//         path: '/',
//         query: { ...this.$route.query, ...params }
//       })
//     },
//     handleChangePage(page: Number) {
//       this.changeQuery({ page })
//     }
//   }
// });
</script>

<style lang="scss">
.article-card {
  padding: 8px;
  margin: 8px;
}
</style>
