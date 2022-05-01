<template>
  <div class='container is-desktop has-text-centered' ref="container">
<!--    <img id="cat" src="/images/000000_min.jpg" alt="" @load="onImgLoad">-->
    <div class="my-wrapper" style="position:relative;" v-bind:style="myStyle">
      <video
          style="position:absolute;left:0"
          autoplay
          playsinline
          muted
          ref="player"
          @playing="playing"
          :width="WW"
          :height="HH"
      ></video>
      <canvas :width="WW" :height="HH" style="position:absolute;z-index:10;left:0" ref="canvas"></canvas>
      <button v-if="deviceIds.length > 1" class="switch-cam" @click="switchCam">
        <font-awesome-icon icon="exchange-alt"/>
      </button>
    </div>
<!--    <button @click="capture">cap</button>-->
  </div>
</template>

<script>

import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import categories from "../../categories.json";
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons'

library.add(faExchangeAlt);

const categoryDic = {};
categories.forEach(v => {
  categoryDic[v.id] = v.name
})

const colors = ['#788ef5', '#7c95f4', '#7f9cf3', '#83a3f2', '#88a9f0', '#8cb0ee', '#90b6ec', '#94bce9', '#98c1e6', '#9dc6e3', '#a1ccdf', '#a5d0db', '#aad5d6', '#aed9d1', '#b3decc', '#b7e2c6', '#bbe5c1', '#c0e9ba', '#c4ecb3', '#c8efac', '#cdf1a5', '#d1f49d', '#d5f694', '#d9f88b', '#ddfa81', '#e1fb77', '#e5fd6c', '#e8fe5f', '#ecfe52', '#efff41', '#d2f44a', '#d8e94d', '#ddde50', '#e2d452', '#e6cb54', '#e9c157', '#ecb859', '#eeaf5a', '#f0a75c', '#f29f5e', '#f39760', '#f59061', '#f68963', '#f68365', '#f77d66', '#f77768', '#f77269', '#f86d6b', '#f8696d', '#f7656f', '#f76271', '#f76072', '#f75f74', '#f65e77', '#f55e79', '#f55e7b', '#f4607d', '#f36280', '#f26582', '#f16885']
const base = import.meta.env.VITE_BASE_URL;
const MODEL_URL = `${base}/model/model.json`;

export default {
  components: {
    FontAwesomeIcon
  },
  async created(){
    this.model = await loadGraphModel(MODEL_URL);
    this.loaded1 = true
  },
  async mounted(){

    const player = this.$refs.player;
    const self = this;

    this.WW = this.$refs.container.clientWidth;

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        self.deviceKinds = devices.map(d => d.kind);
        const deviceIds = devices.filter(d => d.kind === "videoinput").map(d => d.deviceId);
        console.log("deviceIds:", deviceIds);
        self.deviceIds = deviceIds;
        self.deviceId = deviceIds[0];
      })
    }

    const ctx = this.context = this.$refs.canvas.getContext('2d');
    ctx.strokeStyle = "#FF0000";

  },
  data(){
    return {
      WW: 300,
      HH: 300,
      loaded1: false,
      loaded2: false,
      loaded3: false,
      deviceIds: [],
      deviceId: null,
      deviceKinds: []
    }
  },
  computed: {
    loaded(){
      return this.loaded1 && this.loaded2 && this.loaded3;
    },
    myStyle(){
      return {
        width: `${this.WW}px`,
        height: `${this.HH}px`,
      }
    }
  },
  methods:{
    switchCam(){
      console.log("switchCam");
      if (this.deviceIds.length < 2) {
        return
      }
      const curIdx = this.deviceIds.indexOf(this.deviceId)
      let nextIdx = (curIdx === this.deviceIds.length - 1) ? 0 : curIdx + 1
      this.deviceId = this.deviceIds[nextIdx];
    },
    playing(){

      navigator.mediaDevices.enumerateDevices().then(devices => {
        this.deviceKinds = devices.map(d => d.kind);
        const deviceIds = devices.filter(d => d.kind === "videoinput").map(d => d.deviceId);
        this.deviceIds = deviceIds;
        // this.deviceId = deviceIds[0];
      })

      const containerAspect = this.$refs.container.clientWidth / this.$refs.container.clientHeight;
      const videoAspect = this.$refs.player.videoWidth / this.$refs.player.videoHeight;

      // console.log(`containerAspect: ${containerAspect}, videoAspect:${videoAspect}`)

      if(containerAspect > videoAspect){
        this.HH = this.$refs.container.clientHeight;
        this.WW = this.HH * videoAspect;
      }else{
        this.WW = this.$refs.container.clientWidth;
        this.HH = this.WW / videoAspect;
      }

      // this.HH = this.WW * this.$refs.player.videoHeight / this.$refs.player.videoWidth;
      this.loaded3 = true;
    },
    async capture(){
      const video = this.$refs.player;

      const tensor = tf.browser.fromPixels(video);
      const tf4d = tensor.expandDims(0)

      const test_result = await this.model.executeAsync({ image_tensor: tf4d }, [
        // const test_result = this.model.execute({ image_tensor: tf4d }, [
        'detection_boxes',
        'num_detections',
        'detection_classes',
        'detection_scores'
      ]);
      // console.log(test_result);

      const [detection_boxes, num_detections, detection_classes, detection_scores] = test_result.map(d => d.dataSync());
      const num = num_detections[0]

      let i,j, chunk = 4;
      const boxes = []
      for (i = 0,j = num * 4; i < j; i += chunk) {
        boxes.push([...detection_boxes.slice(i, i + chunk)])
      }

      const ctx = this.context;
      // ctx.clearRect(0,0, W, H);
      ctx.clearRect(0,0, this.WW, this.HH);

      [...Array(num).keys()].forEach(idx => {

        if(detection_scores[idx] < 0.6){
          return;
        }

        let [ymin, xmin, ymax, xmax] = boxes[idx];
        // let [x, y, w, h] = boxes[idx];
        const x = this.WW * xmin;
        const y = this.HH * ymin;
        const w = this.WW * (xmax - xmin);
        const h = this.HH * (ymax - ymin);

        const color = colors[idx]

        // draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        // draw label bg
        ctx.fillStyle = color;
        // const strToShow = `${prediction.class}: ${prediction.score}`
        const strToShow = `${categoryDic[detection_classes[idx]]}`
        const textW = ctx.measureText(strToShow).width;

        const font = "15px serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        const textH = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textW + 4, textH + 4);
        //text on top
        ctx.fillStyle = "#000000";
        ctx.fillText(strToShow, x, y);
      });
    }
  },
  watch:{
    async loaded(val){
      if(val){
        // console.log(this.$refs.player.videoWidth)
        // this.$refs.canvas.width = this.$refs.player.clientHeight * this.$refs.player.videoWidth / this.$refs.player.videoHeight;
        // console.log("==999", this.$refs.canvas.width);
        this.context = this.$refs.canvas.getContext('2d');

        setInterval(this.capture, 100);
      }
    },
    deviceId(val, old){
      navigator.mediaDevices.getUserMedia({ video: {deviceId: val} }).then(stream => {
        console.log("handleSuccess", stream);
        this.$refs.player.srcObject = stream;
        this.loaded2 = true
      });
    }
  }
}

</script>

<route lang="yaml">
meta:
  wide: true
  fillScreen: true
  title: Waste Detection
</route>

<style lang="scss">

.hoge{
  background-color:red;
}

.my-wrapper{
  margin-left: auto;
  margin-right: auto;
}

.switch-cam {
  background-color: #fff;
  border-radius: 5px;
  color: #000;
  padding: 10px;
  margin: 10px;
  width: 50px;
  position: absolute;
  z-index: 100;
  left: 0;
}

</style>
