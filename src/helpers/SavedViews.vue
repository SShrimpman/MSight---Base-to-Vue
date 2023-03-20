<template>
  <div class="saved-wrapper">
    <div class="saved-toolbar">
      <span class="saved-add-text">Save new view</span>
      <Icon :icon="icons.plus" class="saved-add spatial-tree-icon" @click="openSavedViewForm" />
    </div>
    <ul class="saved-list" id="saved-views-list">
      <SavedView v-for="savedView in savedViews" :key="savedView.id" :saved-view="savedView" />
    </ul>
  </div>
</template>

<script>
import { icons } from "../configs/icons";
import { savedViews } from "../stores/savedViews";
import SavedView from "../components/savedView.js/SavedView.vue";
import Icon from "../components/generic/icon.vue";
import Form from "../components/savedView.js/Form.vue";

export default {
  name: "SavedViews",
  components: {
    SavedView,
    Icon,
    Form,
  },
  data() {
    return {
      savedViews,
      icons,
      form: null,
    };
  },
  methods: {
    openSavedViewForm(position) {
      // this.form = Form
      // console.log(this.form)
      this.$router.push('/saveView' + position);
    },
  },
};
</script>
