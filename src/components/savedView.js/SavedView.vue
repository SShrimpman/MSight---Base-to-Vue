<template>
  <li class="saved-list-item" :class="{ 'anim-gradient': isEnabled }">
    <span class="saved-list-item-text" @click="toggleView">{{ savedView.note }}</span>
    <MenuItemExtraOptions :options="menuOptions"/>
  </li>
</template>

<script>
import { createElement } from "../../helpers/generic/domElements";
import { loadView, resetView } from "../../helpers/savedView";
import { getActiveId, removeSavedView } from "../../stores/savedViews";
import MenuItemExtraOptions from "../generic/MenuItemExtraOptions.vue";
import ConfirmationPopup from "../ConfirmationPopup.vue";

export default {
  props: {
    savedView: {
      type: Object,
      required: true,
    },
  },
  components: {
    MenuItemExtraOptions,
    ConfirmationPopup,
  },
  data() {
    return {
      isEnabled: false,
      menuOptions: {
        delete: {
          text: "Delete",
          action: () => this.popupConfirmationDeleteSavedView(),
        },
        dummy: {
          text: "A very nice option indeed",
          action: () => console.log("dummy option enabled"),
        },
      },
    };
  },
  methods: {
    toggleView() {
      this.isEnabled = !this.isEnabled;
      if (this.isEnabled) {
        loadView(this.savedView.id);
      } else {
        resetView();
      }
    },
    handleSavedViewChange() {
      const activeId = getActiveId();
      this.isEnabled = this.savedView.id === activeId;
    },
    handleSavedViewRemoval(removedId) {
      if (this.savedView.id === removedId) {
        this.$el.remove();
      }
    },
    popupConfirmationDeleteSavedView() {
      const popupProps = {
        title: "Confirmation",
        subtitle: "",
        message: `Are you sure you want to remove the saved view "${this.savedView.note}"?`,
        affirmativeText: "Remove",
        negativeText: "Cancel",
      };

      const popup = createElement("div");
      document.body.appendChild(popup);

      const confirmationPopup = new Vue({
        render: (h) =>
          h(ConfirmationPopup, {
            props: popupProps,
            onConfirmationResult: (result) => {
              if (result) {
                this.deleteSavedView();
              }
              popup.remove();
            },
          }),
      });

      confirmationPopup.$mount(popup);
    },
    deleteSavedView() {
      removeSavedView(this.savedView.id);
      this.$el.remove();
    },
  },
  created() {
    document.addEventListener("savedViewChanged", this.handleSavedViewChange);
    document.addEventListener("removedSavedView", (e) => this.handleSavedViewRemoval(e.detail.removedId));
  },
  destroyed() {
    document.removeEventListener("savedViewChanged", this.handleSavedViewChange);
  },
};
</script>