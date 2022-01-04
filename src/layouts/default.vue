
<template>
  <main>
    <Header :title="title"/>
    <router-view v-bind:class="{ 'is-desktop': !isWide, container: !isWide, 'fill-screen': fillScreen }" />
<!--    <Footer/>-->
  </main>
</template>

<script>
import { useRouter } from 'vue-router'
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {
    Header, Footer
  },
  data(){
    const meta = useRouter().currentRoute.value.meta;
    return {
      isWide: meta && meta.wide,
      fillScreen: meta && meta.fillScreen,
      title: meta?.title || ""
    }
  },
  metaInfo() {
    return {
      titleTemplate: "%s - Hitokun's",
      meta: [
        { property: `og:locale`, content: `en_EN` },
        {name: 'author', content: 'Toshi'},
        // { key: `og:type`, property: `og:type`, content: `website` },
        // {
        //   key: `og:site_name`,
        //   property: `og:site_name`,
        //   content: `Hitokun's`,
        // },
        // {
        //   key: `og:title`,
        //   property: `og:title`,
        //   content: `Hitokun's`,
        // },
        // {
        //   key: `og:image`,
        //   property: `og:image`,
        //   content: `https://hitokun-s.github.io/images/self.jpg"}`,
        // },
      ]
    }
  },
  watch:{
    $route (to, from){
      const meta = this.$router.currentRoute.value.meta;
      this.isWide = meta && meta.wide;
      this.fillScreen = meta && meta.fillScreen;
      this.title = meta?.title || "";
    }
  }
});
</script>

<!--<static-query>-->
<!--query {-->
<!--metadata {-->
<!--siteName-->
<!--}-->
<!--}-->
<!--</static-query>-->

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

/**,*/
/**:before,*/
/**:after {*/
/*  box-sizing: border-box;*/
/*  margin: 0;*/
/*}*/

.fill-screen{
  height: calc(100vh - 80px);
  overflow-y: hidden;
}

html {
  overflow-y: auto !important; /* Hide scrollbars */
}

</style>
