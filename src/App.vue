<template>
  <canvas id="three-canvas"></canvas>
  <FileInput @file-uploaded="toggleLoading" @file-rendered="hideLoading"/>
  <Loading v-if="showLoading"/>
</template>

<script>
import FileInput from '../src/components/FileInput.vue';
import Loading from '../src/components/Loading.vue'
import buildScene from '../src/helpers/builders/buildScene'
// import userInputs from '../src/components/events/userInputs';
import { mapMutations } from 'vuex';

// let isMouseDragging = false;


export default {
  // data(){
  //   return {
  //     canvas: document.getElementById("three-canvas")
  //   }
  // },
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
    ...mapMutations(['toggleLoading', 'hideLoading']),
    // onFileRendered(){
      
    // }
  },
  mounted() {
    buildScene()
  }
}
</script>

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