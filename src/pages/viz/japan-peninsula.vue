<template>
  <div>
    <div class="bottom-left-pane">
      <p style="font-size:2rem">半島名：<b>{{ selected?.feature.properties.A18_007 || '未選択' }}</b></p>
      <div v-if="selected">
        <p v-for="f in targetFeatures" v-bind:class="{'has-text-weight-bold':f===targetFeature}">
          {{featureDict[f]}}: {{ selected?.feature.properties[f]}}
        </p>
      </div>
    </div>
    <div class="dropdown top-right-pane" v-bind:class="{'is-active': active}" style="position:absolute;z-index:999">
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a href="#" class="dropdown-item" v-for="f in targetFeatures" v-bind:class="{'is-active': f === targetFeature}" @click="fuga(f,$event)">
            {{featureDict[f]}}
          </a>
        </div>
      </div>
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="active=!active" @blur="piyo">
          <span>{{featureDict[targetFeature]}}</span>
          <span class="icon is-small"><font-awesome-icon icon="angle-down"/></span>
        </button>
      </div>
    </div>
    <l-map
        v-model="zoom"
        v-model:zoom="zoom"
        :center="[36.2048, 138.2529]"
        style="height: 100%; width: 100%;"
    >
<!--      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>-->
      <l-tile-layer
          url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGl0b2t1biIsImEiOiJjaXVqYnd0NXUwMGRwMm9tc3RvcGZ1ZDZ5In0.Q4wyiiGDLH_lTi3zzFcAtA"
          attribution="Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
      />

      <l-control-attribution position="bottomright"></l-control-attribution>

      <l-geo-json
          :geojson="geojson"
          :options="options"
          ref="hoge"
      />

      <l-control
          position="bottomright"
          class="bottom-right-pane"
      >
        <div class="columns is-mobile is-marginless is-fullheight">
          <div class="column is-half">
            <span
                style="display:block;width:100%;height:100%;background-image:linear-gradient(to top, white, pink, red);"></span>
          </div>
          <div id="color-scale-legend" class="column is-half">
            <p>{{max}}</p>
            <p>{{min}}</p>
          </div>
        </div>
      </l-control>
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
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import {metaInfo} from "../../util";
import fetch from 'cross-fetch';

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
      zoom: 6,
      iconWidth: 25,
      iconHeight: 40,
      geojson: null,
      options: {
        style: this.style,
        onEachFeature: this.onEachFeatureFunction
      },
      focused: null,
      targetFeatures: [
        "A18_010", // 総人口
        "A18_079", // 老年人口
        "A18_083", // 農林業
        "A18_086", // 漁業
      ],
      targetFeature: "A18_010",
      active: false,
      selected: null,
      featureDict: {
        "A18_010": "総人口",
        "A18_079": "老年人口",
        "A18_083": "農林業就業者",
        "A18_086": "漁業就業者"
      },
      min: 0,
      max: 0
    };
  },
  created(){
    useHead(metaInfo(this,{
      title: "Japan Peninsula",
      description: "Japan Peninsula,日本の半島",
      image: "japan-peninsula.png",
      twittercard: "summary_large_image"
    }));
  },
  async mounted() {
    const base = import.meta.env.VITE_BASE_URL
    const response = await fetch(base + "/data/peninsula.geojson")
    let data = await response.json();
    data.features = data.features.filter(d => d.properties.A18_007 !== "紀伊")
    this.geojson = data;
  },
  computed: {
    features() {
      if (!this.geojson) {
        return [];
      }
      return this.geojson.features.map(d => d.properties);
    },
    colorScale() {
      const min = Math.min(...this.features.map(d => d[this.targetFeature]));
      const max = Math.max(...this.features.map(d => d[this.targetFeature]));
      const [mx2, mn2] = this.fff(max, min)
      this.max = mx2;
      this.min = mn2;
      return chroma.scale(['white', 'pink', 'red']).domain([mn2, mx2]);
    }
  },
  methods: {
    fff(mx, mn){
      const j = Math.pow(10, mx.toString().length - 1)
      return [Math.ceil(mx / j) * j, Math.floor(mn / (j-1)) * (j-1) ]
    },
    onEachFeatureFunction(feature, layer) {
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({
            weight: 4,
            color: 'red',
          });
        },
        mouseout: (e) => {
          console.log("mouseout", e.target)
          if(e.target.feature.properties.A18_001 !== this.selected?.feature.properties.A18_001){
            e.target.setStyle({
              weight: 2,
              color: 'black',
            });
          }
        },
        click: (e) => {
          console.log("click", e.target)
          if(this.selected && (e.target !== this.selected)){
            this.selected.setStyle({
              weight: 2,
              color: "black",
            });
          }
          this.selected = e.target;
          this.selected.setStyle({
            weight: 4,
            color: 'red',
          });
        }
      });
      // layer.bindTooltip(
      //     "<div>code:" +
      //     feature.properties.A18_007 +
      //     "</div>",
      //     {permanent: false, sticky: true}
      // );
    },
    style(feature) {
      return {
        weight: 2,
        color: "black",
        opacity: 0.5,
        fillColor: this.colorScale(feature.properties[this.targetFeature]).name(),
        fillOpacity: 0.5
      }
    },
    fuga(f, e){
      this.targetFeature = f;
      this.active = false;
    },
    piyo(e){
      if(e.relatedTarget.localName === "a"){
        e.preventDefault();
        return
      }
      this.active = false;
    }
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
  title: 日本の半島
</route>

<style lang="scss">

.bottom-right-pane {
  background: #fff;
  margin: 0.5rem;
  border-radius: 0.3em;
  width: 70px;
  height: 100px;
}

.top-right-pane{
  position: absolute;
  right: 0;
  z-index: 9999;
  padding: 0.5rem 0.5rem 0 0.5rem;
  font-size:2em;
}

.bottom-left-pane{
  background: #fff;
  border-radius: 0.3em;
  position: absolute;
  bottom: 0;
  margin: 0.5rem;
  z-index: 9999;
  padding: 0.5em;
}

#color-scale-legend{
  padding-left: 0;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  display: flex;
}

.is-fullheight{
  height: 100%;
}


</style>
