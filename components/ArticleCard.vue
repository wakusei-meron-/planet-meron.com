<template>
  <v-row>
    <v-col>
      <nuxt-link :to="/articles/ + article.slug">
        <v-card class="article-card">
          <v-card-title class="article-card-title">
            {{ article.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ article.date }}
          </v-card-subtitle>
        </v-card>
      </nuxt-link>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    article: {
      type: Object,
      default: undefined
    }
  }
});
</script>

<style scoped lang="scss"></style>
