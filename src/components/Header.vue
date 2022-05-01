<template>

  <header class="navbar container is-desktop">
    <div class="navbar-brand">
      <span class="navbar-item">
      <router-link to="/" class="is-link navbar-item is-size-3 has-text-weight-bold has-text-primary">
        <font-awesome-icon icon="home"/>
        Hitokun's {{title}}
      </router-link>
      </span>
      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" @click="isOpen = !isOpen" v-bind:class="{'is-active': isOpen}">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div v-if="isOpen" class="navbar-end">
      <div class="navbar-item">
        <router-link to="/about">About</router-link>
      </div>
      <div class="navbar-item">
        <router-link to="/viz">Viz</router-link>
      </div>
      <div class="navbar-item">
        <router-link to="/project">Project</router-link>
      </div>
    </div>

    <div class="navbar-menu">
    <div class="navbar-end tabs">
      <ul>
        <li v-bind:class="{ 'is-active': path == '/about' }">
          <router-link to="/about">About</router-link>
        </li>
        <li v-bind:class="{ 'is-active': path == '/art' }">
          <router-link to="/art">Art</router-link>
        </li>
        <li v-bind:class="{ 'is-active': path == '/viz' }">
          <router-link to="/viz">Viz</router-link>
        </li>
        <li v-bind:class="{ 'is-active': path == '/project' }">
          <router-link to="/project">Project</router-link>
        </li>
      </ul>
    </div>
    </div>
  </header>

</template>

<script>
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faHome} from '@fortawesome/free-solid-svg-icons'

  library.add(faHome);

  export default {
    name: "Header",
    props: {
      title: String
    },
    components: {
      FontAwesomeIcon
    },
    data(){
      return {
        isOpen: false
      }
    },
    mounted() {
      console.log(this.$route)
    },
    methods:{
    },
    computed:{
      path(){
        return this.$route.path
      }
    }
  }
</script>

<style lang="scss">

  .navbar-brand svg {
    width: 34px;
  }

  .tabs ul {
    border-bottom-style: none !important;
    li:not(.is-active) a{
      border:none;
    }
  }

</style>

