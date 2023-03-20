<template>
  <div class="styling-menu-extras">
    <Icon iconFileName="dots" @click.native="toggleStatus" :title="title" />
    <ul class="styling-menu-extras-list" :class="{ hidden: !status }">
      <li v-for="(option, index) in options" :key="index" @click="handleOptionClick(option)">
        {{ option.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import Icon from "./icon.vue";

export default {
  name: "MenuItemExtras",
  components: {
    Icon,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      status: false,
      title: "More options",
    };
  },
  methods: {
    toggleStatus() {
      this.status = !this.status;
      this.updatePosition();
    },
    updatePosition() {
      const list = this.$el.querySelector(".styling-menu-extras-list");

      if (this.status) {
        const menuBoundingData = this.$el.getBoundingClientRect();
        const listBoundingData = list.getBoundingClientRect();
        const newPosition = {
          x:
            menuBoundingData.right -
            listBoundingData.left -
            listBoundingData.width,
          y: menuBoundingData.bottom - listBoundingData.top,
        };
        list.style.left = newPosition.x + "px";
        list.style.top = newPosition.y + "px";

        window.addEventListener("click", this.handleOutsideClick);
      } else {
        list.style.left = "0px";
        list.style.top = "0px";

        window.removeEventListener("click", this.handleOutsideClick);
      }
    },
    handleOptionClick(option) {
      this.$emit("optionSelected", option.idx);
      this.toggleStatus();
    },
    handleOutsideClick(event) {
      const elements = [
        this.$el.querySelector(".styling-menu-extras-list"),
      ];

      if (!elements.includes(event.target)) {
        this.toggleStatus();
      }
    },
  },
};
</script>