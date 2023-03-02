<script>
import FileInput from '../src/components/FileInput.vue';
import Loading from '../src/components/Loading.vue'
import buildScene from '../src/helpers/builders/buildScene'

export default {
  methods: {
    buildScene() {
      buildScene()
    }
  },
  components: {
    Loading,
    FileInput
  },
  mounted() {
    this.buildScene()
  }
}
</script>

<template>
  <canvas id="three-canvas"></canvas>
  <!-- <canvas id="three-canvas"></canvas> -->
  <Loading/>
  <FileInput/>
</template>

<style scoped>
#three-canvas {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(0deg, rgb(250, 250, 250) 0%, var(--primary-color-light) 100%);
}
</style>