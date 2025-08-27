export default defineNuxtConfig({
  // Target (https://go.nuxtjs.dev/config-target)
  // target: 'static',
  ssr: true,

  //
  // server: {
  //   port: 3005, //   host: '0.0.0.0'
  // },
  site: {
    url: "https://www.planet-meron.com",
    name: "Planet Meron's Note",
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: "Planet Meron's Note",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Planet Meronの日々感じ、学んだことのメモ",
        },
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: "Planet Meron",
        },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: "https://planet-meron.com",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Planet Meron's Note",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Planet Meronの日々感じ、学んだことのメモ",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "https://www.planet-meron.com/images/self_icon.png",
        },
        { hid: "twitter:card", name: "twitter:card", content: "summary" },
        { hid: "twitter:site", name: "twitter:site", content: "@b0941015" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // nitro: {
  //   prerender: {
  //     routes: ['/sitemap.xml']
  //   }
  // },

  vite: {
    server: {
      allowedHosts: ["genki-x570s-aorus-elite-ax"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/colors.scss" as *;',
        },
      },
    },
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // '~/assets/reset.css',
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/scss/shiki-github-dark.scss", // 公式のドキュメントどおりに設定しても動かないので手動インポート
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  // googleAnalytics: {
  //   // Options
  //   id: 'UA-46699536-4'
  // },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ["@nuxtjs/sitemap", "@nuxt/content"],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ["vuetify"],
  },

  // Nuxt Content settings
  content: {
    build: {
      markdown: {
        toc: {
          depth: 2,
          searchDepth: 2,
        },
        highlight: {
          theme: "github-dark",
          langs: ["go", "python", "sql", "bash", "sh", "shell", "xml", "yaml", "js", "ts", "vue", "css", "html", "json", "javascript", "typescript"],
        },
      },
    },
  },

  compatibilityDate: "2025-01-21",
});
