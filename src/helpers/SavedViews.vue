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
  <!-- <Form ref="form" /> -->
  <!-- <div ref="form"></div> -->
  <!-- <Teleport to="body">
    <div v-if="openSavedViewForm">
      <Form/>
    </div>
  </Teleport> -->
</template>

<script>
import { icons } from "../configs/icons";
import { savedViews } from "../stores/savedViews";
import SavedView from "../components/savedView.js/SavedView.vue";
import Icon from "../components/generic/icon.vue";
import Form from "../components/savedView.js/Form.vue";
import { renderNewViewForm } from "../components/savedView.js/form";

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
      form: false,
    };
  },
  // mounted(){
  //   this.form = Form;
  // },
  methods: {
    openSavedViewForm(position) {
      const form = renderNewViewForm(position);
      form.classList.remove("hidden");
      document.body.appendChild(form);
      // const form = defineComponent(Form);
      // console.log(form);
      // const formInstance = new form.$mount(this.$refs.form)
      // this.form = true 
    },
  },
};
</script>
