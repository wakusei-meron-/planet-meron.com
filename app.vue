<template>
  <v-app>
    <header class="app-header" :class="{ 'app-header--scrolled': isScrolled }">
      <div class="app-header-top">
        <nuxt-link class="logo" to="/">
          <h1 class="logo">Planet MERON's Note</h1>
        </nuxt-link>
        <v-spacer />
        <div class="app-header-social">
          <v-btn
            v-for="icon in icons"
            :key="icon.url"
            :href="icon.url"
            target="_blank"
            icon
            variant="text"
            size="small"
            class="app-header-social-button"
          >
            <v-icon :icon="icon.name" />
          </v-btn>
        </div>
      </div>
      <div class="app-header-bottom">
        <v-spacer />
        <v-tabs 
          v-model="activeTab" 
          color="primary"
          slider-color="primary"
          class="app-header-tabs"
        >
          <v-tab 
            v-for="item in items" 
            :key="item.url" 
            :to="item.url"
            :value="item.url"
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-spacer />
      </div>
    </header>
    <v-main class="app-main">
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
      <v-col class="text-center"> ©planet-meron.com </v-col>
    </v-footer>
    
    <!-- スクロールトップボタン -->
    <v-fab
      v-show="showScrollTop"
      app
      appear
      bottom
      end
      size="small"
      color="primary"
      icon="mdi-chevron-up"
      class="scroll-top-button"
      @click="scrollToTop"
    />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideMenu from "~/components/SideMenu.vue";

export default defineComponent({
  components: { SideMenu },
  data() {
    return {
      items: [
        { name: "Blog", url: "/" },
        { name: "Profile", url: "/profile" },
      ],
      icons: [
        { name: "mdi-github", url: "https://github.com/wakusei-meron-" },
        { name: "mdi-twitter", url: "https://twitter.com/b0941015" },
        {
          name: "mdi-instagram",
          url: "https://www.instagram.com/planet_meron/?hl=ja",
        },
        { name: "mdi-email", url: "mailto:b0941015@gmail.com" },
      ],
      isScrolled: false,
      activeTab: null,
      showScrollTop: false,
    };
  },
  mounted() {
    this.activeTab = this.$route.path;
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {
    '$route.path'(newPath) {
      this.activeTab = newPath === '/' ? '/' : newPath;
    }
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
      this.showScrollTop = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
});
</script>

<style lang="scss">
@use '~/assets/scss/colors' as *;

html {
  font-family:
    "Source Sans Pro",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
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

ul {
  list-style: circle;
}
ol {
  list-style: decimal;
}
li {
  font-weight: bold;
  margin-bottom: 6px;
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
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
}

.app-header {
  position: fixed;
  width: 100%;
  padding: 16px 24px 0px 24px;
  z-index: 100;
  background: white;
  border-bottom: 1px solid $border-light;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px $shadow-sm;
  
  &--scrolled {
    padding: 8px 24px 0px 24px;
    box-shadow: 0 4px 12px $shadow-md;
    
    .app-header-top {
      height: 48px;
    }
    
    .app-header-bottom {
      height: 48px;
    }
    
    .logo {
      width: 250px;
      height: 42px;
    }
  }

  &-top {
    display: flex;
    align-items: center;
    height: 56px;
    transition: height 0.3s ease;
  }
  
  &-social {
    display: flex;
    gap: 4px;
    
    &-button {
      color: $text-secondary;
      transition: all 0.2s ease;
      
      &:hover {
        color: $primary;
        transform: translateY(-2px);
      }
    }
  }

  &-bottom {
    display: flex;
    align-items: flex-end;
    height: 56px;
    transition: height 0.3s ease;
  }
  
  &-tabs {
    :deep(.v-tab) {
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: none;
      transition: all 0.2s ease;
      
      &:hover {
        color: $primary;
      }
    }
    
    :deep(.v-tab--active) {
      font-weight: 600;
    }
  }
}

.app-main {
  margin-top: 128px;
  background-color: $bg-secondary;
  min-height: calc(100vh - 128px);
}

.v-footer {
  background-color: $gray-800 !important;
  color: $white;
  padding: 24px 0;
  margin-top: 48px;
}

.scroll-top-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}

// ページ遷移アニメーション
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// ローディングアニメーション
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-skeleton {
  background: linear-gradient(
    90deg,
    $bg-secondary 0%,
    $bg-tertiary 50%,
    $bg-secondary 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
</style>