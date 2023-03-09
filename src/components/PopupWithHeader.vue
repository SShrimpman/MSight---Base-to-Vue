<template>
    <div class="popup-wrapper" v-show="visible">
        <div :class="['popup-header-wrapper', { 'popup-header-wrapper-full': occupiesFullScreen }]">
            <div class="popup-header">
                <i class="popup-header-icon" :class="props.icon"></i>
                <div class="popup-header-text">{{ props.title }}</div>
                <div class="popup-header-subtitle">{{ props.subtitle }}</div>
                <i class="popup-header-close" @click.stop="close"></i>
            </div>
        </div>
        <div class="popup-content" @click.stop>
            <slot></slot>
        </div>
    </div>
</template>
  
<script>
import { icons } from "../configs/icons";
import { emitEventOnElement } from "../helpers/emitEvent";
import { createElement } from "../helpers/generic/domElements";
import { buildIcon } from "./generic/icon";
import { buildModal } from "./generic/modal";

export default {
    name: "PopupWithHeader",
    props: {
        title: String,
        subtitle: String,
        icon: String,
        occupiesFullScreen: {
            type: Boolean,
            default: false,
        },
        preventPropagation: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
            emitEventOnElement(this.$el, "toggle");
        },
        handleStates() {
            const triggers = [this.$el, this.$refs.close];
            triggers.forEach((element) => {
                element.addEventListener("click", (e) => {
                    this.close();
                });
            });
        },
        buildHeader() {
            const header = createElement("div", {
                classes: ["popup-header"],
            });
            header.innerHTML = `
            <div class="popup-header-text">${this.props.title}</div>
            <div class="popup-header-subtitle">${this.props.subtitle}</div>
            `;

            // add icons
            const icon = buildIcon(this.props.icon);
            icon.classList.add("popup-header-icon");
            header.insertBefore(icon, header.firstElementChild);

            const close = buildIcon(icons.close);
            close.classList.add("popup-header-close");
            this.$refs.close = close;
            header.insertBefore(close, header.lastElementChild);

            return header;
        },
    },
    mounted() {
        const popup = buildModal();
        const wrapper = popup.firstElementChild;
        if (this.occupiesFullScreen) {
            wrapper.classList.add("popup-header-wrapper-full");
        }

        // Header
        const header = this.buildHeader();
        // inserts node on top
        wrapper.insertBefore(header, wrapper.firstElementChild);

        this.handleStates();

        if (this.preventPropagation) {
            wrapper.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }

        this.$el.appendChild(popup);
    },
};
</script>
  
<style scoped>
.popup-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-header-wrapper {
    background-color: white;
    padding: 20px;
}

.popup-header-wrapper-full {
    width: 100%;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.popup-header-text {
    font-size: 20px;
    font-weight: bold;
}

.popup-header-subtitle {
    font-size: 16px;
    color: gray;
}

.popup-header-icon,
.popup-header-close {
    font-size: 24px;
    cursor: pointer;
}

.popup-content {
    padding: 20px;
}
</style>