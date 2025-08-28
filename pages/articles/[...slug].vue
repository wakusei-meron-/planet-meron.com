<template>
  <article class="article">
    <dl>
      <dt class="article-date">
        <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
        {{ formattedDate }}
      </dt>
      <dd>
        <h1 class="article-title">{{ article?.title }}</h1>
      </dd>
    </dl>

    <!-- <div v-if="!!article?.image" class="article-hero">
      <ClientOnly>
        <v-img 
          :src="article?.image" 
          max-height="400"
          cover
          class="article-hero-image"
        />
        <template #fallback>
          <div style="height: 400px; background-color: #f5f5f5;"></div>
        </template>
      </ClientOnly>
    </div> -->
    <div v-if="!!article?.image" class="article-hero">
      <ClientOnly>
        <v-img
          v-if="isClient" 
          :src="article?.image"
          max-height="400"
          cover
          class="article-hero-image"
        />
        <template #fallback>
          <div style="height: 400px; background-color: #f5f5f5;"></div>
        </template>
      </ClientOnly>
    </div>

    <div class="article-tags">
      <v-chip 
        v-for="tag in article?.tags" 
        :key="tag"
        color="primary"
        variant="tonal"
        size="small"
        class="mr-2"
      >
        {{ tag }}
      </v-chip>
    </div>

    <div class="article-toc" v-if="toc && toc.length > 0">
      <h2 class="article-toc-title">目次</h2>
      <nav class="article-toc-nav">
        <ul>
          <li v-for="link in toc" :key="link.id" :class="`toc-level-${link.depth}`">
            <a :href="`#${link.id}`" @click="scrollToSection(link.id, $event)">
              {{ link.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- <div class="article-body">
      <ContentRenderer :value="article" />
    </div> -->
    <div class="article-body" v-if="article">
      <ContentRenderer :value="article" />
    </div>
    <div v-else class="article-body">
      <!-- ごく簡単なフォールバック -->
      <p>Loading...</p>
    </div>

    <div class="article-share">
      <h3 class="article-share-title">この記事をシェア</h3>
      <div class="article-share-buttons">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          icon
          :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(fullUrl)}`"
          target="_blank"
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          icon
          :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`"
          target="_blank"
        >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          icon
          :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`"
          target="_blank"
        >
          <v-icon>mdi-linkedin</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          icon
          @click="copyUrl"
        >
          <v-icon>{{ copied ? 'mdi-check' : 'mdi-link-variant' }}</v-icon>
        </v-btn>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { formatDate } from '~/utils/dateUtils'

const path = useRoute().path
const config = useRuntimeConfig()

// const { data: article } = await useAsyncData(`articles-${path}`, () => {
//   return queryCollection('articles').path(path).first()
// })
const { data: article } = await useAsyncData(
  `articles-${path}`,
  () => queryCollection('articles').path(path).first(),
  {
    // SSRリロード時の未定義参照を防ぐための初期値
    default: () => ({
      title: '',
      description: '',
      image: null,
      tags: [],
      body: null
    })
  }
)
 


const formattedDate = computed(() => {
  if (article.value?.date) {
    return formatDate(article.value.date)
  }
  return ''
})

const fullUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return `${config.public.siteUrl || 'https://planet-meron.com'}${path}`
})

// const toc = ref([])
type TocItem = { id: string; text: string; depth: 2 | 3 }
const toc = ref<TocItem[]>([])
const copied = ref(false)
const isClient = ref(false)


onMounted(async () => {
  await nextTick()
  isClient.value = true
  generateToc()
})

const generateToc = () => {
  // const headings = document.querySelectorAll('.article-body h2, .article-body h3')
  // toc.value = Array.from(headings).map((heading, index) => {
  const headings = document.querySelectorAll('.article-body h2, .article-body h3')
  toc.value = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`
    heading.setAttribute('id', id)
    return {
      id,
      // text: heading.textContent,
      text: (heading.textContent || '').trim(),
      depth: heading.tagName === 'H2' ? 2 : 3
    }
  })
}

const scrollToSection = (id: string, event: Event) => {
  event.preventDefault()
  const element = document.getElementById(id)
  if (element) {
    const offset = 140 // Header height
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

useHead({
  title: article?.value?.title,
  meta: [
    { hid: "og:type", name: "og:type", content: "article" },
    {
      hid: "description",
      name: "description",
      content: article?.value?.description,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: article?.value?.title,
    },
    {
      hid: "og:url",
      property: "og:url",
      content: fullUrl.value,
    },
    {
      hid: "og:description",
      property: "og:description",
      content: article?.value?.description,
    },
    {
      hid: "og:image",
      property: "og:image",
      content: article?.value?.image || '/images/default-og.png',
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/colors' as *;

.article {
  background: $white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px $shadow-sm;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  &-date {
    color: $text-secondary;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
  }
  
  &-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 16px 0 24px;
    color: $text-primary;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  &-hero {
    margin: 24px -32px;
    
    @media (max-width: 768px) {
      margin: 20px -20px;
    }
    
    &-image {
      border-radius: 0;
    }
  }

  &-tags {
    margin: 24px 0;
    padding: 16px 0;
    border-bottom: 1px solid $border-light;
  }
  
  &-toc {
    background: $bg-secondary;
    border-radius: 8px;
    padding: 24px;
    margin: 32px 0;
    
    &-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: $text-primary;
    }
    
    &-nav {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      li {
        margin-bottom: 8px;
        font-weight: normal;
        
        &.toc-level-3 {
          margin-left: 20px;
        }
        
        a {
          color: $text-secondary;
          transition: color 0.2s ease;
          
          &:hover {
            color: $primary;
          }
        }
      }
    }
  }

  &-body {
    margin: 32px 0;
    
    :deep() {
      h1, h2, h3, h4, h5, h6 {
        margin-top: 2em;
        margin-bottom: 1em;
        font-weight: 600;
        line-height: 1.3;
        color: $text-primary;
      }
      
      h1 { font-size: 2rem; }
      h2 { font-size: 1.75rem; }
      h3 { font-size: 1.5rem; }
      h4 { font-size: 1.25rem; }
      
      p {
        margin-bottom: 1.5em;
        line-height: 1.8;
        color: $text-primary;
      }
      
      ul, ol {
        margin-bottom: 1.5em;
        padding-left: 2em;
        
        li {
          margin-bottom: 0.5em;
          line-height: 1.8;
          font-weight: normal;
        }
      }
      
      blockquote {
        border-left: 4px solid $primary;
        padding-left: 1em;
        margin: 1.5em 0;
        color: $text-secondary;
        font-style: italic;
      }
      
      // インラインコード
      code {
        background: $bg-tertiary;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
        color: $primary-dark;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      }
      
      // コードブロック（ProseCodeコンポーネントでスタイリングされるため最小限に）
      pre {
        margin: 0;
        
        code {
          background: none;
          padding: 0;
          color: inherit;
        }
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        
        th, td {
          border: 1px solid $border-light;
          padding: 0.75em;
          text-align: left;
        }
        
        th {
          background: $bg-secondary;
          font-weight: 600;
        }
      }
      
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1.5em 0;
      }
      
      a {
        color: $primary;
        text-decoration: underline;
        transition: color 0.2s ease;
        overflow-wrap: break-word;
        
        &:hover {
          color: $primary-dark;
        }
      }
    }
  }
  
  &-share {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid $border-light;
    text-align: center;
    
    &-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: $text-primary;
    }
    
    &-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  }
}
</style>