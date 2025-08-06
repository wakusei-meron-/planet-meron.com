<template>
  <v-row>
    <v-col>
      <nuxt-link :to="article.path" class="article-card-link">
        <v-card 
          class="article-card" 
          :class="{ 'article-card--has-image': article.image }"
          elevation="0"
          hover
        >
          <div class="article-card-content">
            <div class="article-card-main">
              <div class="article-card-header">
                <v-chip
                  v-if="article.tags && article.tags[0]"
                  size="x-small"
                  :color="getTagColor(article.tags[0])"
                  variant="tonal"
                  class="article-card-primary-tag"
                >
                  {{ article.tags[0] }}
                </v-chip>
                <span class="article-card-date">
                  <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(article.date) }}
                </span>
              </div>
              
              <h3 class="article-card-title">
                {{ article.title }}
              </h3>
              
              <p class="article-card-description">
                {{ article.description || generateDescription(article.title) }}
              </p>
              
              <div class="article-card-footer">
                <div class="article-card-tags">
                  <v-chip
                    v-for="tag in article.tags?.slice(1, 4)"
                    :key="tag"
                    size="x-small"
                    variant="text"
                    class="mr-1 px-2"
                  >
                    #{{ tag }}
                  </v-chip>
                </div>
                <v-icon size="20" color="primary">mdi-arrow-right</v-icon>
              </div>
            </div>
            
            <v-img
              v-if="article.image"
              :src="article.image"
              width="180"
              height="135"
              cover
              class="article-card-image"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </div>
        </v-card>
      </nuxt-link>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from "vue";
import { formatDate } from '~/utils/dateUtils'

export default defineComponent({
  props: {
    article: {
      type: Object,
      default: undefined,
    },
  },
  methods: {
    formatDate,
    generateDescription(title) {
      return title.length > 80 ? title.substring(0, 80) + '...' : title + 'についての記事です。';
    },
    getTagColor(tag) {
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
        'Web': 'teal',
        'セキュリティ': 'red',
        'パフォーマンス': 'green',
        'アーキテクチャ': 'deep-purple'
      };
      return tagColors[tag] || 'primary';
    }
  }
});
</script>

<style scoped lang="scss">
@use '~/assets/scss/colors' as *;

.article-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid $border-light;
  overflow: hidden;
  height: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px $shadow-md;
    border-color: transparent;
    
    .article-card-title {
      color: $primary;
    }
    
    .article-card-footer v-icon {
      transform: translateX(4px);
    }
  }
  
  &-content {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    min-height: 180px;
  }
  
  &-main {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  &-primary-tag {
    font-weight: 500;
    letter-spacing: 0.025em;
  }
  
  &-date {
    font-size: 0.75rem;
    color: $text-tertiary;
    display: flex;
    align-items: center;
  }
  
  &-title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 8px;
    transition: color 0.3s ease;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  &-description {
    color: $text-secondary;
    font-size: 0.875rem;
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }
  
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    v-icon {
      transition: transform 0.3s ease;
    }
  }
  
  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  &-image {
    flex-shrink: 0;
    border-left: 1px solid $border-light;
  }
  
  &--has-image {
    .article-card-main {
      padding-right: 12px;
    }
  }
  
  @media (max-width: 600px) {
    &-content {
      flex-direction: column;
    }
    
    &-image {
      width: 100% !important;
      height: 160px !important;
      border-left: none;
      border-top: 1px solid $border-light;
      order: -1;
    }
    
    &--has-image {
      .article-card-main {
        padding-right: 20px;
      }
    }
  }
}
</style>