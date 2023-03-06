<script>
import FileInput from '../src/components/FileInput.vue';
import Loading from '../src/components/Loading.vue'
import buildScene from '../src/helpers/builders/buildScene'
import { mapMutations } from 'vuex';

export default {
  components: {
    Loading,
    FileInput
  },
  computed: {
    showLoading(){
      return this.$store.state.showLoading;
    }
  },
  methods: {
    ...mapMutations(['toggleLoading', 'hideLoading'])
  },
  mounted() {
    buildScene()
  }
}
</script>

<template>
  <canvas id="three-canvas"></canvas>
  <FileInput @file-uploaded="toggleLoading" @file-rendered="hideLoading"/>
  <Loading v-if="showLoading"/>
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