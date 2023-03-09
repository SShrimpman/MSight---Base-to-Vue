<template>
    <div class="popup-header-content">
      <form class="styling-form" @submit.prevent="handleSubmit">
        <label for="annotation-form-category-name" class="styling-form-label">Name</label>
        <input type="text" id="annotation-form-category-name" class="styling-form-input" v-model="name" name="note">
        
        <label for="annotation-form-category-reference" class="styling-form-label">Reference</label>
        <input type="text" id="annotation-form-category-reference" class="styling-form-input" v-model="reference" name="reference" title="3 letters, underscore, 3 numbers" placeholder="AAA-000">
        
        <label for="color" class="styling-form-label">Color</label>
        <div class="styling-form-color-picker-wrapper">
          <color-picker v-model="color"></color-picker>
        </div>
        
        <p v-if="errorMessage" class="styling-form-warning">{{ errorMessage }}</p>
        
        <input type="submit" value="Create" class="styling-form-submit">
      </form>
    </div>
  </template>
  
  <script>
  import AnnotationCategory from "../../models/AnnotationCategory";
  import { addAnnotationCategory } from "../../stores/annotationCategories";
  import { annotationCategoryValidator } from "../../validators/annotationCategory/annotationCategory";
  import { icons } from "../../configs/icons";
  import { buildPopupWithHeader } from "../PopupWithHeader";
  import { renderChangesAfterLoad } from "../generic/colorPicker";
  import { createElement } from "../../helpers/generic/domElements";
  
  export default {
    name: "AnnotationCategoryForm",
    data() {
      return {
        name: "",
        reference: "",
        color: "#000000",
        errorMessage: null,
      };
    },
    mounted() {
      this.render();
    },
    methods: {
      render() {
        const headerProps = {
          title: "Annotation Category",
          subtitle: "Create a new annotation category",
          icon: icons.annotations,
        };
  
        const popup = buildPopupWithHeader(headerProps);
        popup.classList.toggle("hidden");
        document.body.appendChild(popup);
  
        this.$el.appendChild(popup.getElementsByClassName("popup-header-content")[0]);
  
        renderChangesAfterLoad(popup.querySelector(".color-picker"));
  
        popup.addEventListener("toggle", () => {
          popup.remove();
        });
  
        popup.addEventListener("click", () => {
          popup.remove();
        });
      },
      handleSubmit() {
        const obj = { name: this.name, color: this.color.slice(1), reference: this.reference.toUpperCase() };
  
        const result = annotationCategoryValidator(obj);
  
        if (result === true) {
          this.saveAnnotationCategory(obj);
          this.$emit("category-added");
        } else {
          const references = [
            { name: "Name", element: this.$refs.nameInput },
            { name: "Reference", element: this.$refs.referenceInput },
            { name: "Color", element: this.$refs.colorPickerComponent },
          ];
          this.displayErrors(references, result);
        }
      },
      displayErrors(references, errors) {
        let errorElements = [];
  
        for (let idx = 0; idx < errors.length; idx++) {
          const message = errors[idx];
          const element = references.find((x) =>
            message.includes(element.name)
            ).element;
            if (element) {
              element.classList.add("styling-form-input-error");
              const errorMessage = createElement("p", {
                class: "styling-form-warning",
                textContent: message,
              });
              element.parentElement.appendChild(errorMessage);
              errorElements.push(errorMessage);
            }
          }
        
          this.errorMessage = "Please fix the errors above.";
        
          setTimeout(() => {
            errorElements.forEach((el) => el.remove());
            references.forEach((ref) =>
              ref.element.classList.remove("styling-form-input-error")
            );
            this.errorMessage = null;
          }, 5000);
        },
        async saveAnnotationCategory(obj) {
          const category = new AnnotationCategory(obj);
        
          try {
            const response = await addAnnotationCategory(category);
            if (response.status === 201) {
              this.$router.push({ name: "annotations" });
            }
          } catch (error) {
            console.log("error", error);
          }
        },
        },
  };
  </script>
  
  <style scoped>
  .styling-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  
  .styling-form-label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .styling-form-input {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #d6d6d6;
    border-radius: 0.25rem;
  }
  
  .styling-form-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  .styling-form-input-error {
    border-color: var(--error-color);
  }
  
  .styling-form-warning {
    color: var(--error-color);
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  
  .styling-form-submit {
    background-color: var(--primary-color);
    color: #fff;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .styling-form-submit:hover {
    background-color: var(--primary-color-dark);
  }
  
  .styling-form-color-picker-wrapper {
    margin-bottom: 1rem;
  }
  
  .popup-header-content {
    padding: 1rem;
  }
  </style>