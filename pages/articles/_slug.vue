<template>
  <article class="article">
    <dl>
      <dd>{{ article.date }}</dd>
    </dl>
    <h1 class="article-title">{{ article.title }}</h1>
    <div v-if="!!article.image"><img :src="article.image" /></div>

    <div class="article-tags">
      <v-chip outlined v-for="tag in article.tags" :key="tag">
        #{{ tag }}
      </v-chip>
    </div>

    <nuxt-content :document="article" />
    <div v-if="false" class="article-sns-share">
      <div class="article-sns-share-button">
        <div class="article-sns-share-button-twitter">
          <a href="">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import FontAwesomeIcon from "@nuxtjs/fontawesome";

export default {
  head() {
    return {
      title: this.title,
      meta: [
        { hid: "description", name: "description", content: this.description },
        {
          hid: "og:description",
          property: "og:description",
          content: this.description
        },
        { hid: "og:title", property: "og:title", content: this.title }
      ]
    };
  },
  async asyncData({ $content, params }) {
    const article = await $content("articles", params.slug || "index").fetch();
    return {
      article,
      title: article.title,
      description: article.description
    };
  }
};
</script>
<style lang="scss" scoped>
.article {
  &-title {
    padding-bottom: 12px;
    font-size: 2rem;
  }

  &-tags {
    text-align: right;
    padding-bottom: 18px;
  }

  &-sns-share {
    //position: absolute;
    //overflow: hidden;
    top: 0;
    bottom: 0;
    left: 50%;
    transition: -50%;
    //  //translateX(- 50 %);
    margin: auto;
    height: 44px;
    min-width: 268px;

    &-button {
      float: left;
      box-shadow: inset 0 0 0 2px #000;
      border-radius: 100%;
      //+anim
      a {
        display: table-cell;
        width: 44px;
        height: 44px;
        color: $black;
        text-align: center;
        vertical-align: middle;
      }

      i {
        font-size: 20px;
        vertical-align: middle;
        //&: hover;
        box-shadow: inset 0 0 0 22px $black;
      }

      &-twitter {
        &:hover {
          a {
            color: #1b95e0;
          }
        }
      }
    }
  }
}
</style>
