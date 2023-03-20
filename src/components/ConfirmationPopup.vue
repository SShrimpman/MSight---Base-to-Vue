<template>
  <PopupWithHeader :title="title" :subtitle="subtitle" :icon="icon" @toggle="removePopup">
    <div class="confirmation-popup-wrapper">
      <span>{{ message }}</span>
      <div :class="affirmativeClass" @click="emitActionToParent(true)">{{ affirmativeText }}</div>
      <div :class="negativeClass" @click="emitActionToParent(false)">{{ negativeText }}</div>
    </div>
  </PopupWithHeader>
</template>
  
<script>
import { icons } from "../configs/icons";
import { emitCustomEventOnElement } from "../helpers/emitEvent";
import PopupWithHeader from "./PopupWithHeader.vue";

export default {
  name: "ConfirmationPopup",
  components: {
    PopupWithHeader,
  },
  props: {
    title: String,
    subtitle: String,
    message: String,
    affirmativeText: String,
    negativeText: String,
    isWarning: Boolean,
  },
  computed: {
    affirmativeClass() {
      return !this.isWarning ? "confirm" : "reject";
    },
    negativeClass() {
      return !this.isWarning ? "reject" : "cancel";
    },
    icon() {
      return icons.helper;
    },
  },
  methods: {
    emitActionToParent(result) {
      emitCustomEventOnElement(this.$el, "confirmationResult", { result });
    },
    removePopup() {
      this.$el.remove();
    },
  },
};
</script>
  