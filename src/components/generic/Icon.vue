<template>
  <img :src="iconDirectory" />
</template>

<script>
export default {
  name: "Icon",
  props: {
    iconFileName: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconDirectory() {
      return `./src/assets/icons/${this.iconFileName}.svg`;
    },
  },
};
</script>
