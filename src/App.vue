<template>
  <Render/>
</template>

<script>
import buildScene from '../src/helpers/builders/buildScene'
import Render from '../src/components/Render.vue'

export default {
  components: {
    Render
  },
  mounted() {
    buildScene()
  }
}
</script>