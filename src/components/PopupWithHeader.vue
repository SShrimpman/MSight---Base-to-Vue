<template>
    <div class="modal" ref="popup" :class="{ 'hidden': isHidden }" @toggle="toggle">
        <!-- <div class="popup-header-wrapper" :class="{ 'popup-header-wrapper-full': occupiesFullScreen }"
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
    </div> -->
        <div class="popup-header">
            <Icon :iconFileName="icons.icon" class="popup-header-icon" />
            <div class="popup-header-text">{{ title }}</div>
            <div class="popup-header-subtitle">{{ subtitle }}</div>
            <div class="popup-header-wrapper" :class="{ 'popup-header-wrapper-full': occupiesFullScreen }">
                <div class="popup-header-content">
                    <slot></slot>
                </div>
            </div>
            <Icon :iconFileName="icons.close" class="popup-header-close" ref="closePopup" @click="toggle" />
        </div>
    </div>
</template>
  
<script>
import { icons } from "../configs/icons";
import Icon from "./generic/Icon.vue";

export default {
    data() {
        return {
            isHidden: true,
        }
    },
    components: {
        Icon,
    },
    props: {
        title: String,
        subtitle: String,
        occupiesFullScreen: Boolean,
        preventPropagation: Boolean,
    },
    mounted() {
        this.handleStates();
        this.occupiesFullScreen();
        this.preventPropagation();
    },
    methods: {
        handleStates() {
            const triggers = [this.$refs.popup, this.$refs.closePopup];
            triggers.forEach((element) => {
                element.addEventListener("click", (e) => {
                    this.$emit("toggle");
                });
            });
        },
        occupiesFullScreen() {
            const wrapper = this.$el.querySelector('.popup-header-wrapper');
            if (this.occupiesFullScreen) {
                wrapper.classList.add('popup-header-wrapper-full');
            }
        },
        preventPropagation() {
            const wrapper = this.$el.querySelector('.popup-header-wrapper');
            if (this.preventPropagation) {
                wrapper.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        },
        toggle() {
            this.isHidden = !this.isHidden;
        },
    }
};
// import { icons } from "../configs/icons";
// import { emitEventOnElement } from "../helpers/emitEvent";
// import Icon from "./generic/icon.vue";

// export default {
//     name: "PopupHeader",
//     components: {
//         Icon,
//     },
//     props: {
//         title: String,
//         subtitle: String,
//         icon: String,
//         preventPropagation: {
//             type: Boolean,
//             default: true,
//         },
//         occupiesFullScreen: {
//             type: Boolean,
//             default: false,
//         },
//     },
//     mounted() {
//         this.popup = this.$el.closest('.popup-wrapper');
//         this.close = this.$el.querySelector('.popup-header-close');
//         this.handleStates();
//     },
//     beforeUnmount() {
//         if (this.popup && this.popup.parentNode) {
//             this.popup.parentNode.removeChild(this.popup);
//         }
//     },
//     methods: {
//         handleStates() {
//             const triggers = [this.popup, this.close];
//             triggers.forEach((element) => {
//                 element.addEventListener("click", (e) => {
//                     emitEventOnElement(element, "toggle");
//                 });
//             });
//         },
//         closePopup() {
//             this.$emit("close");
//         },
//     },
// };
</script>