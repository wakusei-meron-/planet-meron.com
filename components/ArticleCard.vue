<template>
  <v-row>
    <v-col>
      <nuxt-link :to="article._path">
        <v-card class="article-card">
          <v-card-title class="article-card-title">
            {{ article.title }}
          </v-card-title>
          <v-card-subtitle>
            <v-row>
              <v-col>
                {{ article.date }}
              </v-col>
              <v-spacer />
              <v-col class="text-right">
                <span class="text-right" v-for="tag in article.tags">
                  #{{ tag }}
                </span>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>
      </nuxt-link>
    </v-col>
  </v-row>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    article: {
      type: Object,
      default: undefined
    }
  }
});
</script>

<style scoped lang="scss"></style>
