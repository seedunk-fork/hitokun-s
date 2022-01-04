<template>
  <div>
    <div class="dropdown" v-bind:class="{'is-active': active}" style="position:absolute;z-index:999">
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a href="#" class="dropdown-item">
            Dropdown item
          </a>
          <a class="dropdown-item">
            Other dropdown item
          </a>
          <a href="#" class="dropdown-item is-active">
            Active dropdown item
          </a>
          <a href="#" class="dropdown-item">
            Other dropdown item
          </a>
          <hr class="dropdown-divider">
          <a href="#" class="dropdown-item">
            With a divider
          </a>
        </div>
      </div>
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="active = !active">
          <span>Dropdown button</span>
          <span class="icon is-small">
            <font-awesome-icon icon="angle-down"/>
<!--            <font-awesome-icon :icon="['fas', 'angle-down']"/>-->
<!--                <i class="fas fa-angle-down" aria-hidden="true"></i>-->
              </span>
        </button>
      </div>
    </div>
    <l-map
        v-model="zoom"
        v-model:zoom="zoom"
        :center="[47.41322, -1.219482]"
        @move="log('move')"
        style="height: 100%; width: 100%;"
    >
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>

      <l-geo-json
          :geojson="geojson"
          :options="options"
          ref="hoge"
      />

      <l-control
          position="topright"
          class="bottom-right-pane"
      >
        focused: {{ focused?.properties.name }}<br/>
        {{ targetFeature }}
      </l-control>

      <l-control
          position="bottomright"
          class="bottom-right-pane"
      >
        <span
            style="display:block;width:10vh;height:20vh;background-image:linear-gradient(to top, white, pink, red);"></span>
      </l-control>

      <l-control
          position="bottomleft"
          class="bottom-right-pane"
      >
        <label><input type="radio" v-model="targetFeature" value="pop_est">人口</label>
        <label><input type="radio" v-model="targetFeature" value="gdp_md_est">GDP</label>
      </l-control>


      <!--      <l-control-layers />-->
      <!--      <l-marker :lat-lng="[0, 0]" draggable @moveend="log('moveend')">-->
      <!--        <l-tooltip>-->
      <!--          lol-->
      <!--        </l-tooltip>-->
      <!--      </l-marker>-->

      <!--      <l-marker :lat-lng="[47.41322, -1.219482]">-->
      <!--        <l-icon :icon-url="iconUrl" :icon-size="iconSize" />-->
      <!--      </l-marker>-->

      <!--      <l-marker :lat-lng="[50, 50]" draggable @moveend="log('moveend')">-->
      <!--        <l-popup>-->
      <!--          lol-->
      <!--        </l-popup>-->
      <!--      </l-marker>-->

      <!--      <l-polyline-->
      <!--          :lat-lngs="[-->
      <!--          [47.334852, -1.509485],-->
      <!--          [47.342596, -1.328731],-->
      <!--          [47.241487, -1.190568],-->
      <!--          [47.234787, -1.358337],-->
      <!--        ]"-->
      <!--          color="green"-->
      <!--      ></l-polyline>-->
      <!--      <l-polygon-->
      <!--          :lat-lngs="[-->
      <!--          [46.334852, -1.509485],-->
      <!--          [46.342596, -1.328731],-->
      <!--          [46.241487, -1.190568],-->
      <!--          [46.234787, -1.358337],-->
      <!--        ]"-->
      <!--          color="#41b782"-->
      <!--          :fill="true"-->
      <!--          :fillOpacity="0.5"-->
      <!--          fillColor="#41b782"-->
      <!--      />-->
      <!--      <l-rectangle-->
      <!--          :lat-lngs="[-->
      <!--          [46.334852, -1.509485],-->
      <!--          [46.342596, -1.328731],-->
      <!--          [46.241487, -1.190568],-->
      <!--          [46.234787, -1.358337],-->
      <!--        ]"-->
      <!--          :fill="true"-->
      <!--          color="#35495d"-->
      <!--      />-->
      <!--      <l-rectangle-->
      <!--          :bounds="[-->
      <!--          [46.334852, -1.190568],-->
      <!--          [46.241487, -1.090357],-->
      <!--        ]"-->
      <!--      >-->
      <!--        <l-popup>-->
      <!--          lol-->
      <!--        </l-popup>-->
      <!--      </l-rectangle>-->
    </l-map>
  </div>
</template>
<script>
import {
  LGeoJson,
  LMap,
  LIcon,
  LTileLayer,
  LMarker,
  LControl,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import * as chroma from "chroma-js"
import fetch from 'cross-fetch';

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'

library.add(faAngleDown);

export default {
  components: {
    LGeoJson,
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControl,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
    FontAwesomeIcon
  },
  data() {
    return {
      zoom: 2,
      iconWidth: 25,
      iconHeight: 40,
      geojson: null,
      options: {
        style: (feature) => ({
          weight: 2,
          color: "black",
          opacity: 0.5,
          fillColor: this.colorScale(feature.properties[this.targetFeature]).name(),
          fillOpacity: 0.5
        }),
        onEachFeature: this.onEachFeatureFunction
      },
      focused: null,
      targetFeature: "gdp_md_est",
      // colorScale: ["e7d090", "e9ae7b", "de7062"],
      active: false
    };
  },
  async created() {
    const base = import.meta.env.VITE_BASE_URL
    const response = await fetch(base + "/data/africa.geo.json")
    const data = await response.json();
    this.geojson = data;
  },
  mounted() {
    console.log("root", this.$refs)
  },
  // async beforeMount() {
  //   const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");
  //
  //   this.options.style = (feature) => ({
  //     weight: 2,
  //     color: "black",
  //     opacity: 0.5,
  //     fillColor: this.colorScale(feature.properties[this.targetFeature]).name(),
  //     fillOpacity: 0.5
  //   });
  //   this.options.onEachFeature = this.onEachFeatureFunction
  // },
  computed: {
    features() {
      if (!this.geojson) {
        return [];
      }
      return this.geojson.features.map(d => d.properties);
    },
    iconUrl() {
      return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`;
    },
    iconSize() {
      return [this.iconWidth, this.iconHeight];
    },
    // style() {
    //   return (feature) => ({
    //     weight: 2,
    //     color: "black",
    //     opacity: 0.5,
    //     fillColor: this.colorScale(feature.properties[this.targetFeature]).name(),
    //     fillOpacity: 0.5
    //   })
    // },
    // options() {
    //   return {
    //     targetFeature: this.targetFeature,
    //     style: this.style,
    //     onEachFeature: this.onEachFeatureFunction
    //   };
    // },
    colorScale() {
      console.log("colorScale")
      const min = Math.min(...this.features.map(d => d[this.targetFeature]));
      const max = Math.max(...this.features.map(d => d[this.targetFeature]));
      return chroma.scale(['white', 'pink', 'red']).domain([min, max]);
    }
  },
  methods: {
    onEachFeatureFunction(feature, layer) {
      layer.on({
        mouseover: (e) => {
          console.log(e.target.feature.properties.name);
          this.focused = e.target.feature;

          const layer = e.target;
          console.log(layer);
          layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
          });
        },
        // mouseout: resetHighlight,
        // click: zoomToFeature
      });
      layer.bindTooltip(
          "<div>code:" +
          feature.properties.name +
          "</div>",
          {permanent: false, sticky: true}
      );
    },
    // style(feature) {
    //   return {
    //     weight: 2,
    //     color: "black",
    //     opacity: 0.5,
    //     fillColor: this.colorScale(feature.properties[this.targetFeature]).name(),
    //     fillOpacity: 0.5
    //   }
    // },
    log(a) {
      console.log(a);
    },
  },
  watch: {
    targetFeature(val) {
      for (const layer_id in this.$refs.hoge.leafletObject._layers) {
        const layer = this.$refs.hoge.leafletObject._layers[layer_id]
        layer.setStyle({
          fillColor: this.colorScale(layer.feature.properties[this.targetFeature]).name(),
        });
      }
    }
  }
};
</script>

<route lang="yaml">
meta:
  wide: true
  fillScreen: true
</route>

<style lang="scss">

.bottom-right-pane {
  background: #fff;
  padding: 1vh;
  border: 1px solid #aaa;
  border-radius: 0.3em;
  width: 22vh;
}

</style>
