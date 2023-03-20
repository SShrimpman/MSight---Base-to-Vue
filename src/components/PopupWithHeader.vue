<template>
    <div class="popup-header-wrapper" :class="{ 'popup-header-wrapper-full': occupiesFullScreen }"
        @click.prevent="closePopup">
        <div class="popup-header">
            <Icon :iconFileName="props.icon" class="popup-header-icon" />
            <div class="popup-header-text">{{ props.title }}</div>
            <div class="popup-header-subtitle">{{ props.subtitle }}</div>
            <Icon :iconFileName="icons.close" class="popup-header-close" @click.stop="closePopup" />
        </div>
        <div class="popup-header-content">
            <slot></slot>
        </div>
    </div>
</template>
  
<script>
import { icons } from "../configs/icons";
import { emitEventOnElement } from "../helpers/emitEvent";
import Icon from "./generic/icon.vue";

export default {
    name: "PopupHeader",
    components: {
        Icon,
    },
    props: {
        title: String,
        subtitle: String,
        icon: String,
        preventPropagation: {
            type: Boolean,
            default: true,
        },
        occupiesFullScreen: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.popup = this.$el.closest('.popup-wrapper');
        this.close = this.$el.querySelector('.popup-header-close');
        this.handleStates();
    },
    beforeUnmount() {
        if (this.popup && this.popup.parentNode) {
            this.popup.parentNode.removeChild(this.popup);
        }
    },
    methods: {
        handleStates() {
            const triggers = [this.popup, this.close];
            triggers.forEach((element) => {
                element.addEventListener("click", (e) => {
                    emitEventOnElement(element, "toggle");
                });
            });
        },
        closePopup() {
            this.$emit("close");
        },
    },
};
</script>