<template>
  <section class="sidemenu-profile">
    <nuxt-link to="/profile">
      <v-img src="/images/self_icon.png" class="sidemenu-profile-image" />
    </nuxt-link>
    <h2 class="sidemenu-profile-name">
      Planet MERON
    </h2>
    <p class="sidemenu-profile-description">
      渋谷でIT留学後、代官山の不動産テックベンチャーの立ち上げに参画。
      ねこ・音声・統計周りに興味ありありで学術的なことにもっと関わりたい。
      最近無線周りを勉強中。
    </p>
  </section>
</template>

<script>
export default {
  name: "SideMenu"
};
</script>

<style scoped lang="scss">
.sidemenu-profile {
  padding: 12px;
  &-image {
    margin: 0 auto 12px;
    max-width: 60%;
  }
  &-name {
    font-size: 1.5rem;
    margin: 16px auto 12px;
    text-align: center;
  }
  &-description {
    line-height: 1.5;
  }
}
</style>
