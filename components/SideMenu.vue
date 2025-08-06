<template>
  <div class="sidemenu">
    <!-- プロフィールセクション -->
    <v-card class="sidemenu-section" elevation="0">
      <div class="sidemenu-profile">
        <nuxt-link to="/profile">
          <v-avatar size="120" class="sidemenu-profile-avatar">
            <v-img src="/images/self_icon.png" />
          </v-avatar>
        </nuxt-link>
        <h2 class="sidemenu-profile-name">Planet MERON</h2>
        <p class="sidemenu-profile-description">
          渋谷でIT留学後、代官山の不動産テックベンチャーの立ち上げに参画。
          ねこ・音声・統計周りに興味ありありで学術的なことにもっと関わりたい。
          最近無線周りを勉強中。
        </p>
        <div class="sidemenu-profile-social">
          <v-btn
            v-for="social in socials"
            :key="social.url"
            :href="social.url"
            target="_blank"
            icon
            size="small"
            variant="text"
          >
            <v-icon :icon="social.icon" size="20" />
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- 検索セクション -->
    <v-card class="sidemenu-section" elevation="0">
      <h3 class="sidemenu-title">
        <v-icon size="20" class="mr-2">mdi-magnify</v-icon>
        記事を検索
      </h3>
      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        placeholder="キーワードを入力..."
        hide-details
        single-line
        @keyup.enter="search"
      >
        <template v-slot:append-inner>
          <v-icon @click="search" style="cursor: pointer">mdi-magnify</v-icon>
        </template>
      </v-text-field>
    </v-card>

    <!-- 人気記事セクション -->
    <v-card class="sidemenu-section" elevation="0" v-if="popularArticles.length > 0">
      <h3 class="sidemenu-title">
        <v-icon size="20" class="mr-2">mdi-fire</v-icon>
        人気の記事
      </h3>
      <v-list density="compact" class="sidemenu-list">
        <v-list-item
          v-for="(article, index) in popularArticles"
          :key="article.path"
          :to="article.path"
          class="sidemenu-list-item"
        >
          <template v-slot:prepend>
            <div class="sidemenu-rank" :class="`sidemenu-rank--${index + 1}`">
              {{ index + 1 }}
            </div>
          </template>
          <v-list-item-title class="sidemenu-list-title">
            {{ article.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="sidemenu-list-date">
            {{ formatDate(article.date) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- タグクラウドセクション -->
    <v-card class="sidemenu-section" elevation="0" v-if="tagCloud.length > 0">
      <h3 class="sidemenu-title">
        <v-icon size="20" class="mr-2">mdi-tag-multiple</v-icon>
        タグクラウド
      </h3>
      <div class="sidemenu-tagcloud">
        <v-chip
          v-for="tag in tagCloud"
          :key="tag.name"
          :size="getTagSize(tag.count)"
          :color="getTagColor(tag.name)"
          variant="tonal"
          class="ma-1"
          @click="searchByTag(tag.name)"
        >
          {{ tag.name }}
          <span class="sidemenu-tag-count">({{ tag.count }})</span>
        </v-chip>
      </div>
    </v-card>

    <!-- 最新記事セクション -->
    <v-card class="sidemenu-section" elevation="0" v-if="recentArticles.length > 0">
      <h3 class="sidemenu-title">
        <v-icon size="20" class="mr-2">mdi-clock-outline</v-icon>
        最新の記事
      </h3>
      <v-list density="compact" class="sidemenu-list">
        <v-list-item
          v-for="article in recentArticles"
          :key="article.path"
          :to="article.path"
          class="sidemenu-list-item"
        >
          <v-list-item-title class="sidemenu-list-title">
            {{ article.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="sidemenu-list-date">
            {{ formatDate(article.date) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatDate } from '~/utils/dateUtils'

const router = useRouter()
const searchQuery = ref('')
const popularArticles = ref([])
const recentArticles = ref([])
const tagCloud = ref([])

const socials = [
  { icon: 'mdi-github', url: 'https://github.com/wakusei-meron-' },
  { icon: 'mdi-twitter', url: 'https://twitter.com/b0941015' },
  { icon: 'mdi-instagram', url: 'https://www.instagram.com/planet_meron/?hl=ja' },
  { icon: 'mdi-email', url: 'mailto:b0941015@gmail.com' }
]

// 全記事を取得
const { data: allArticles } = await useAsyncData('sidebar-articles', () => {
  return queryCollection('articles')
    .select('id', 'path', 'title', 'date', 'tags')
    .order('date', 'DESC')
    .all()
})

// データが取得できたら処理
if (allArticles.value && allArticles.value.length > 0) {
  // 最新記事（5件）
  recentArticles.value = allArticles.value.slice(0, 5)
  
  // 人気記事（ランダムに5件選択 - 実際はアクセス数などで判定）
  // 記事が5件以上ある場合のみ人気記事を表示
  if (allArticles.value.length > 5) {
    const shuffled = [...allArticles.value].sort(() => 0.5 - Math.random())
    popularArticles.value = shuffled.slice(0, 5)
  }
  
  // タグクラウドの生成
  const tagCounts = {}
  allArticles.value.forEach(article => {
    if (article.tags) {
      article.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  
  tagCloud.value = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

const search = () => {
  if (searchQuery.value.trim()) {
    router.push(`/?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const searchByTag = (tag) => {
  router.push(`/?tag=${encodeURIComponent(tag)}`)
}

const getTagSize = (count) => {
  if (count >= 10) return 'default'
  if (count >= 5) return 'small'
  return 'x-small'
}

const getTagColor = (tag) => {
  const tagColors = {
    'Go': 'cyan',
    'Python': 'blue',
    'JavaScript': 'yellow',
    'TypeScript': 'blue',
    'Vue': 'green',
    'React': 'light-blue',
    'AWS': 'orange',
    'Docker': 'blue',
    'MySQL': 'orange',
    'PostgreSQL': 'indigo',
    'Ubuntu': 'deep-orange',
    'Linux': 'black',
    'Git': 'red',
    'API': 'purple',
    'Web': 'teal'
  }
  return tagColors[tag] || 'primary'
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/colors' as *;

.sidemenu {
  &-section {
    background: $white;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid $border-light;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: $text-primary;
    display: flex;
    align-items: center;
  }
  
  &-profile {
    text-align: center;
    
    &-avatar {
      margin: 0 auto 16px;
      border: 3px solid $primary;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px $shadow-md;
      }
    }
    
    &-name {
      font-size: 1.375rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: $text-primary;
    }
    
    &-description {
      font-size: 0.875rem;
      line-height: 1.6;
      color: $text-secondary;
      margin-bottom: 16px;
    }
    
    &-social {
      display: flex;
      justify-content: center;
      gap: 4px;
      
      .v-btn {
        color: $text-secondary;
        
        &:hover {
          color: $primary;
        }
      }
    }
  }
  
  &-list {
    background: transparent;
    padding: 0;
    
    &-item {
      padding: 8px 0;
      min-height: auto;
      border-radius: 4px;
      transition: all 0.2s ease;
      
      &:hover {
        background: $bg-secondary;
        
        .sidemenu-list-title {
          color: $primary;
        }
      }
    }
    
    &-title {
      font-size: 0.875rem;
      line-height: 1.4;
      font-weight: 500;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    &-date {
      font-size: 0.75rem;
      color: $text-tertiary;
      margin-top: 4px;
    }
  }
  
  &-rank {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.75rem;
    background: $bg-tertiary;
    color: $text-secondary;
    
    &--1 {
      background: #FFD700;
      color: $white;
    }
    
    &--2 {
      background: #C0C0C0;
      color: $white;
    }
    
    &--3 {
      background: #CD7F32;
      color: $white;
    }
  }
  
  &-tagcloud {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    
    .v-chip {
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px $shadow-sm;
      }
    }
  }
  
  &-tag-count {
    font-size: 0.75em;
    opacity: 0.7;
    margin-left: 4px;
  }
}

:deep(.v-field__input) {
  font-size: 0.875rem;
}
</style>