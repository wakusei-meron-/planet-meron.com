<script lang="ts" setup>
const countPerPage = 10

const route = useRoute()
const router = useRouter()

// クエリパラメータの取得
const searchQuery = computed(() => route.query.q as string || '')
const tagFilter = computed(() => route.query.tag as string || '')

let page = computed({
  get(){
    return Number(route.query.page || 1)
  },
  set(val: any){
    changeQuery("page", val)
  },
})

const changeQuery = (key: string, val: number | string) => {
  router.push({
    query: {...route.query, [key]: val}
  })
}

let offset = computed(() => {
  return (page.value - 1) * countPerPage
})

// 特殊文字をエスケープする関数
const escapeForLike = (str: string): string => {
  return str.replace(/[%_]/g, '\\$&')
}

// フィルタリングされた記事数を取得
const { data: articlesCountData, refresh: refreshCount } = await useAsyncData(
  `allArticles-${searchQuery.value}-${tagFilter.value}`,
  async () => {
    let query = queryCollection('articles')
    
    // 検索クエリでフィルタリング（LIKE演算子を使用）
    if (searchQuery.value) {
      const escaped = escapeForLike(searchQuery.value)
      query = query.where('title', 'LIKE', `%${escaped}%`)
    }
    
    // タグでフィルタリング（LIKE演算子を使用）
    if (tagFilter.value) {
      const escaped = escapeForLike(tagFilter.value)
      query = query.where('tags', 'LIKE', `%${escaped}%`)
    }
    
    return query.count()
  }
)
const articlesCount = computed(() => articlesCountData?.value || 0)

// フィルタリングされた記事を取得
let { data: articles, refresh } = await useAsyncData(
  `articles-${offset.value}-${searchQuery.value}-${tagFilter.value}`,
  async () => {
    let query = queryCollection('articles')
      .select("id", "path", "title", "date", "tags", "description")
      .order("date", "DESC")
    
    // 検索クエリでフィルタリング（LIKE演算子を使用）
    if (searchQuery.value) {
      const escaped = escapeForLike(searchQuery.value)
      query = query.where('title', 'LIKE', `%${escaped}%`)
    }
    
    // タグでフィルタリング（LIKE演算子を使用）
    if (tagFilter.value) {
      const escaped = escapeForLike(tagFilter.value)
      query = query.where('tags', 'LIKE', `%${escaped}%`)
    }
    
    return query
      .limit(countPerPage)
      .skip(offset.value)
      .all()
  }
)

// クエリパラメータが変更されたときにデータを再取得
watch([searchQuery, tagFilter], () => {
  page.value = 1
  refreshCount()
  refresh()
})

watch(page, () => {
  refresh()
})

// 検索やタグフィルタをクリア
const clearFilters = () => {
  router.push({ query: {} })
}
</script>

<template>
  <div class="article-container">
    <!-- フィルタ表示 -->
    <div v-if="searchQuery || tagFilter" class="filter-info">
      <v-alert
        type="info"
        variant="tonal"
        closable
        @click:close="clearFilters"
      >
        <div class="filter-content">
          <span v-if="searchQuery">
            「{{ searchQuery }}」で検索中
          </span>
          <span v-if="searchQuery && tagFilter"> / </span>
          <span v-if="tagFilter">
            タグ「{{ tagFilter }}」でフィルタ中
          </span>
          <span class="filter-count">
            （{{ articlesCount }}件の記事）
          </span>
        </div>
      </v-alert>
    </div>
    
    <!-- 記事一覧 -->
    <div class="article-card-container">
      <div v-if="articles && articles.length > 0">
        <div v-for="a in articles" :key="a.id" class="article-card">
          <article-card v-bind:article="a"></article-card>
        </div>
      </div>
      <div v-else class="no-articles">
        <v-icon size="64" color="grey">mdi-file-document-search-outline</v-icon>
        <p>該当する記事が見つかりませんでした</p>
        <v-btn
          color="primary"
          variant="tonal"
          @click="clearFilters"
        >
          フィルタをクリア
        </v-btn>
      </div>
    </div>
    
    <!-- ページネーション -->
    <div v-if="articlesCount > countPerPage" class="text-center mt-8">
      <v-pagination 
        :length="Math.ceil(articlesCount / countPerPage)" 
        v-model="page"
        color="primary"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/colors' as *;

.article-container {
  min-height: 500px;
}

.filter-info {
  margin-bottom: 24px;
  
  .filter-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .filter-count {
    color: $text-secondary;
    font-size: 0.875rem;
  }
}

.article-card {
  padding: 8px;
  margin: 8px;
}

.no-articles {
  text-align: center;
  padding: 80px 20px;
  color: $text-secondary;
  
  p {
    margin: 16px 0 24px;
    font-size: 1.125rem;
  }
}
</style>