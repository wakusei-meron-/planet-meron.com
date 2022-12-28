<template>
  <a :href="props.url || props.src" target="_blank">
    <v-card class="embed-link">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="text-h5">
            {{ link?.title }}
          </v-card-title>
          <v-card-subtitle class="embed-link-subtitle">{{ hostName(props.url || props.src )}}</v-card-subtitle>

          <v-card-text class="embed-link-text">{{ link?.description }}</v-card-text>
        </div>

        <v-img class="embed-link-image" :src="link?.image" cover></v-img>
      </div>
    </v-card>
  </a>
</template>

<script lang="ts" setup>
interface Link {
  src: string
  url: string
}

const props = withDefaults(defineProps<Link>(), {
  src: "",
  url: ""
})

const { data: link } = await useFetch(`/.netlify/functions/embed-links?url=${props.src}`)

const hostName = (url: string) => url.split('/')[2]
</script>

<style scoped lang="scss">
.embed-link {
  margin: 16px 8px;
  overflow: hidden;

  &-image{
    width: 200px;
    object-fit: cover;
  }

  &-text {
    height: 100px;
  }
}
</style>
