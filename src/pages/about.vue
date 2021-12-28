<template>
    <div class="container is-desktop">
      <!--<header class="navbar">-->
      <!--<div class="navbar-brand">-->
      <!--<a href="/">-->
      <!--<font-awesome-icon icon="home" />-->
      <!--</a>-->
      <!--</div>-->
      <!--</header>-->

      <main class="columns section">
        <div class="submenu column is-3">
          <aside class="box has-text-centered">
            <figure id="fig-self-img" class="image media-content has-text-centered">
              <img id="self-img" alt="self photo" class="is-rounded" src="/images/self.jpg">
            </figure>
          </aside>
          <aside class="box has-text-centered is-size-3">
            <p>Toshi</p>
          </aside>
          <Social/>
          <aside class="menu">
            <p class="menu-label">
              Address
            </p>
            <ul class="menu-list">
              <li>hopping countries</li>
            </ul>
            <p class="menu-label">
              Mail
            </p>
            <ul class="menu-list">
              <li>jgpuauno(at)gmail.com</li>
            </ul>
            <p class="menu-label">
              Profession
            </p>
            <ul class="menu-list">
              <li>Web Service Full-Stack Engineer</li>
              <li>Machine Learning Engineer</li>
            </ul>
            <p class="menu-label">
              Speaking
            </p>
            <ul class="menu-list">
              <li>Japanese</li>
              <li>English</li>
              <li>Spanish(a bit)</li>
              <li>Russian(learning)</li>
            </ul>
          </aside>
        </div>
        <div class="column">
          <about class="content"></about>
        </div>
      </main>
    </div>
</template>

<script>

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faHome} from '@fortawesome/free-solid-svg-icons'
import Social from "../components/Social.vue";
import about from "../md/about.md"
// import {useMeta} from "vue-meta";


import {metaInfo} from "../util"

library.add(faHome)

export default {
  created(){
    useHead(metaInfo(this,{
      title: "About Hitokun",
      description: "About Hitokun",
      type: "profile"
    }));
  },
  components: {
    FontAwesomeIcon, Social, about
  },
}
</script>

<style lang="scss">

@import "../assets/main.scss";

.box {
  box-shadow: none !important;
}

.box {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.menu-list li {
  padding: 0.5em 0.75em !important;
}

h1 {
  color: $primary-dark !important;
}

#fig-self-img{
  @include until($tablet) {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>

