<template>
  <v-app :style="{ background: $vuetify.theme.themes.light.background }">
    <v-app-bar class="header">
      <v-toolbar-title>Planet MERON's Note</v-toolbar-title>
      <v-spacer></v-spacer>
      <a
        href="https://github.com/wakusei-meron-"
        class="header-icon"
        target="_blank"
      >
        <v-btn icon>
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </a>
      <a
        href="https://twitter.com/b0941015"
        class="header-icon"
        target="_blank"
      >
        <v-btn icon>
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
      </a>
      <a
        href="https://www.instagram.com/planet_meron/?hl=ja"
        class="header-icon"
        target="_blank"
      >
        <v-btn icon>
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
      </a>
      <a href="mailto:b0941015@gmail.com" class="header-icon" target="_blank">
        <v-btn icon>
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </a>
    </v-app-bar>
    <v-app-bar flat>
      <v-tabs centered class="ml-n9" color="grey darken-1">
        <v-tab v-for="item in items" :key="item.url" :to="item.url">
          {{ item.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <v-col class="text-center">
        ©planet-meron.com
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      items: [
        { name: "Blog", url: "/" },
        { name: "Profile", url: "/profile" }
      ]
    };
  }
});
</script>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
}

a {
  text-decoration: none;
}
</style>
