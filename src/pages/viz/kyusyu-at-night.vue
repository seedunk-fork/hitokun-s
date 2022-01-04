<template>
  <div class='mapPane'>
    <font-awesome-icon class="spinner" :icon="['fas', 'spinner']" v-if="loading"/>
    <input step="1" min="0" max="100" value="30" type="range" @input="darken" @change="darken"
           class="input-range is-fullwidth is-circle"/>
    <a href="https://earthobservatory.nasa.gov/features/NightLights/page3.php" class="data-source">data source</a>
    <div id='map'></div>
  </div>
</template>

<script>

import 'leaflet/dist/leaflet.css'
import 'plotty';
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {defineComponent} from "vue";
import {metaInfo} from "../../util";
import fetch from 'cross-fetch';

library.add(faSpinner)

export default defineComponent({
  created(){
    useHead(metaInfo(this,{
      title: "Kyusyu at night",
      description: "Kyusyu at night （九州夜景）",
      image: "kyusyu-at-night.png",
      twittercard: "summary_large_image"
    }));
  },
  name: 'MapPane',
  components: {FontAwesomeIcon},
  data: () => {
    return {
      loading: true,
      layer: null,
    }
  },
  mounted: function () {

    // マップオブジェクト生成
    this.mapCreate();
  },
  methods: {
    // マップオブジェクト生成
    mapCreate: async function () {

      const L = await import('leaflet')
      await import('leaflet-geotiff')
      await import('leaflet-geotiff/leaflet-geotiff-plotty.js')
      const { default: parse_georaster} = (await import("georaster"))
      const { default: GeoRasterLayer} = (await import("georaster-layer-for-leaflet"))

      const self = this;

      // const url = 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png'
      const url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGl0b2t1biIsImEiOiJjaXVqYnd0NXUwMGRwMm9tc3RvcGZ1ZDZ5In0.Q4wyiiGDLH_lTi3zzFcAtA'

      const m_mono = new L.TileLayer(url, {
        attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
      });

      //MAP読み込み
      const map = new L.Map('map', {
        center: [32.648625, 130.759277],
        zoom: 8,
        zoomControl: true,
        layers: [m_mono]
      });

      const base = import.meta.env.VITE_HOGE

      fetch(base + "/data/kyusyu4326.tif")
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            parse_georaster(arrayBuffer).then(georaster => {
              self.layer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.3,
                resolution: 200 // optional parameter for adjusting display resolution
              }).addTo(map);

              map.whenReady(() => {
                self.loading = false;
              })
            })
          })
    },
    darken: function (e) {
      this.layer.setOpacity(e.target.value / 100);
    }
  }
})

</script>

<route lang="yaml">
meta:
  wide: true
  fillScreen: true
</route>

<style lang="scss">

#map {
  z-index: 0;
  height: 100%;
  //height: calc(100vh - 80px);
  text-align: left;
}

.leaflet-map-pane {
  transform: translate3d(0px, -152px, 0px);
}

.leaflet-pane {
  height: 100%;
}

svg path {
  stroke: #fff;
  stroke-width: 1px;
}

svg text {
  text-anchor: middle;
  dominant-baseline: middle;
}

.label {
  text-align: center;
}

.leaflet-container {
  background-color: rgba(255, 0, 0, 0.0);
}

.leaflet-container path {
  fill-opacity: 1;
  fill: lightgrey;
}

.source {
  position: absolute;
  top: 3px;
  right: 5px;
}

.title {
  padding-top: 3px;
  padding-left: 6px;
}

.mapPane {
  position: relative;
}

.input-range[type=range] {
  position: absolute;
  z-index: 9999;
  top: 10px;
  right: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  height: 12px;
  border: 3px solid grey;
  border-radius: 6px;

  &:focus,
  &:active {
    outline: none;
  }
}

/* WebKit向けのつまみ */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /*  🚩デフォルトのつまみのスタイルを解除 */
  cursor: pointer;
  background: grey; /* 背景色 */
  width: 24px; /* 幅 */
  height: 24px; /* 高さ */
  border-radius: 50%; /* 円形に */
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15); /* 影 */
}

/* Moz向けのつまみ */
input[type="range"]::-moz-range-thumb {
  cursor: pointer;
  background: grey; /* 背景色 */
  width: 24px; /* 幅 */
  height: 24px; /* 高さ */
  border-radius: 50%; /* 円形に */
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15); /* 影 */
  border: none; /* デフォルトの線を消す */
}

/* Firefoxで点線が周りに表示されてしまう問題の解消 */
input[type="range"]::-moz-focus-outer {
  border: 0;
}

/* つまみをドラッグしているときのスタイル */
input[type="range"]:active::-webkit-slider-thumb {
  box-shadow: 0px 5px 10px -2px rgba(0, 0, 0, 0.3);
}

.data-source {
  position: absolute;
  z-index: 9999;
  color: #000;
  left: 10px;
  bottom: 10px;
}

/* Define an animation behavior */
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

/* This is the class name given by the Font Awesome component when icon contains 'spinner' */
.fa-spinner {
  /* Apply 'spinner' keyframes looping once every second (1s)  */
  animation: spinner 2s linear infinite;
}

.spinner {
  position: absolute;
  z-index: 10000;
  width: 60vh !important;
  height: 60vh;
  top: calc(50% - 30vh);
  left: calc(50% - 30vh);
}

</style>
