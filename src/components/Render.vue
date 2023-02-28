<script setup>
import FileInput from './FileInput.vue';
import Loading from './Loading.vue'
</script>

<template>
  <div id="three-canvas">
    <Loading/>
    <FileInput/>
  </div>
</template>

<style scoped>
#three-canvas {
  position: fixed;
  font-family: var(--font-family);
  top: 0;
  left: 0;
  outline: none;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  background-image: linear-gradient(0deg, rgb(250, 250, 250) 0%, var(--primary-color-light) 100%);
}
</style>
