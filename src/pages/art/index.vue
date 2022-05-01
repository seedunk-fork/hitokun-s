<template>
    <div class="hero-body">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-one-quarter-desktop is-half-tablet" v-for="info in sites">
            <a :href="info.path">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img :src="info.image" alt="Placeholder image">
                  </figure>
                </div>
                <header class="card-header">
                  <p class="card-header-title">
                    {{ info.title }}
                  </p>
                </header>
                <div class="card-content">
                  <div class="content">
                    {{ info.description }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import sites from "../../site.json";
import {metaInfo} from "../../util";

export default {
  name: 'List',
  data: () => {
    return {
      sites: sites.filter(d => d.path.includes("@art"))
    }
  },
  created() {
    useHead(metaInfo(this,{
      title: "Hitokun's Arts",
      description: "Hitokun's Arts",
    }));
  },
  components: {},
  computed: {}
}
</script>

<route lang="yaml">
meta:
  title: Arts
</route>
