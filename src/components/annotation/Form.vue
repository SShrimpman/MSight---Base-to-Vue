<template>
  <div class="annotation-popup" :class="{ hidden: !isOpen }">
    <div class="popup-header">
      <div class="popup-header-icon">
        <i class="fa fa-bookmark"></i>
      </div>
      <div class="popup-header-title">
        <h2 class="popup-header-title-text">Annotations</h2>
        <p class="popup-header-subtitle">Create a new annotation</p>
      </div>
      <div class="popup-header-close">
        <button class="btn btn-icon btn-clear" @click="closePopup">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
    <div class="popup-content">
      <form @submit.prevent="submitForm" class="styling-form">
        <label class="styling-form-label">Selected view</label>
        <input type="text" disabled class="styling-form-input annotation-form-input" :value="activeViewText">
        <label for="category" class="styling-form-label">Category</label>
        <div class="styling-form-select-plus-add annotation-category-selector">
          <form-select :options="categoriesWithColors" @change="selectCategory" v-model="selectedCategoryId" />
          <i class="fa fa-plus styling-form-icon" @click="openCategoryForm"></i>
        </div>
        <label for="name" class="styling-form-label">Annotation</label>
        <input type="text" id="annotation-form-name" class="styling-form-input annotation-form-input" v-model="annotationName">
        <span class="styling-form-warning" v-if="formError">{{ formError }}</span>
        <input type="submit" value="Create" class="styling-form-submit">
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { icons } from '../../configs/icons';
import { emitGlobalEvent } from '../../helpers/emitEvent';
import { lightOrDark } from '../../helpers/generic/colors';
import { Annotation } from '../../models/Annotation';
import { annotationCategories } from '../../stores/annotationCategories';
import { addAnnotation } from '../../stores/annotations';
import * as SavedViewsStore from '../../stores/savedViews';
import { buildIcon } from '../generic/icon';
import { buildPopupWithHeader } from '../PopupWithHeader';
import { renderAnnotationCategoryForm } from './categoryForm';

export default {
  props: {
    isOpen: Boolean,
    position: Object,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const categoriesWithColors = computed(() =>
      annotationCategories.map((category) => {
        const color = category.color ? `#${category.color}` : null;
        return { value: category.id, text: category.name, color };
      })
    );
    const selectedCategoryId = ref(null);
    const annotationName = ref('');
    const activeSavedView = SavedViewsStore.savedViews.find((x) => x.id == SavedViewsStore.getActiveId());
    const activeViewText = computed(() => activeSavedView ? activeSavedView.note : 'Global');
    const formError = ref(null);

    const submitForm = () => {
      if (!annotationName.value) {
        formError.value = 'Please write an annotation';
        return;
      }

      saveAnnotation();
      emit('close');
    };

    const saveAnnotation = () => {
      const content = annotationName.value;
      const categoryId = selectedCategoryId.value;
      const annotation = new Annotation({ content, categoryId });
      addAnnotation(annotation);
      emitGlobalEvent('annotationAdded', { annotation });
    };

    const selectCategory = (categoryId) => {
      selectedCategoryId.value = categoryId;
    };

    const openCategoryForm = () => {
      const popup = buildPopupWithHeader({
        title: 'Add annotation category',
        content: renderAnnotationCategoryForm({ onClose: closeCategoryForm }),
      });
      emit('open-popup', popup);
    };

    const closeCategoryForm = () => {
      emit('close-popup');
    };

    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        selectedCategoryId.value = null;
        annotationName.value = '';
        formError.value = null;
      }
    });

    return {
      categoriesWithColors,
      selectedCategoryId,
      annotationName,
      activeViewText,
      formError,
      submitForm,
      selectCategory,
      openCategoryForm,
      closePopup: () => emit('close'),
    };
  },
  components: {
    formSelect: buildIcon(icons.FormSelect),
  },
};