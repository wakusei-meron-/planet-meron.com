<template>
  <v-app>
      <v-app-bar flat class="bg-grey-lighten-3 px-3">
        <nuxt-link class="logo" to="/">
          <h1 class="logo">
            Planet MERON's Note
          </h1>
        </nuxt-link>
        <v-spacer></v-spacer>
        <a
          v-for="icon in icons"
          :key="icon.url"
          :href="icon.url"
          class="header-icon"
          target="_blank"
        >
          <v-btn icon>
            <v-icon :icon="icon.name" color="grey-darken-1"/>
          </v-btn>
        </a>
      </v-app-bar>
      <v-app-bar flat class="bg-grey-lighten-3 px-3" density="compact">
        <v-spacer />
        <v-tabs centered class="ml-n9" color="grey-darken-2">
          <v-tab v-for="item in items" :key="item.url" :to="item.url">
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-spacer />
      </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" xs="12" sm="8">
            <NuxtPage />
          </v-col>
          <v-col cols="12" xs="12" sm="4">
            <side-menu />
          </v-col>
        </v-row>
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
import {defineComponent} from "vue";
import SideMenu from "~/components/SideMenu.vue";

export default defineComponent({
  components: { SideMenu },
  data() {
    return {
      items: [
        { name: "Blog", url: "/" },
        { name: "Profile", url: "/profile" }
      ],
      icons: [
        { name: "mdi-github", url: "https://github.com/wakusei-meron-" },
        { name: "mdi-twitter", url: "https://twitter.com/b0941015" },
        {
          name: "mdi-instagram",
          url: "https://www.instagram.com/planet_meron/?hl=ja"
        },
        { name: "mdi-email", url: "mailto:b0941015@gmail.com" }
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

a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
}

a {
  color: inherit;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
}

.logo {
  display: block;
  width: 300px;
  height: 50px;
  background: url("./assets/logo_main.png") no-repeat;
  background-size: cover;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
}

//.v-application code {
//  background-color: rgba(0, 0, 0, 0);
//  color: rgba(0, 0, 0, 222);
//}

//.nuxt-content {
//  * {
//    margin-bottom: 20px;
//  }
//  h2 {
//    font-weight: bold;
//    font-size: 1.5rem;
//  }
//
//  h3 {
//    font-weight: bold;
//    font-size: 1.2rem;
//  }
//
//  p {
//  }
//
//  ul {
//    list-style: circle;
//  }
//  ol {
//    list-style: decimal;
//  }
//  li {
//    font-weight: bold;
//    margin-bottom: 6px;
//  }
//}
</style>
