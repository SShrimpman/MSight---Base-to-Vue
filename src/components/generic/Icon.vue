<template>
  <img :src="iconPath" :class="[iconClass]" @click="handleClick" />
</template>
  
<script>
export default {
  props: {
    iconFileName: {
      type: String,
      required: true,
    },
    iconClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconPath() {
      return `./src/assets/icons/${this.iconFileName}.svg`;
    },
  },
  methods: {
    handleClick() {
      console.log("icon click!")
      this.$emit('click');
    },
  },
};
</script>