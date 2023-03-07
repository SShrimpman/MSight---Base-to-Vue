<template>
    <form class="styling-form">
      <label class="styling-form-label">Selected view</label>
      <input type="text" disabled class="styling-form-input annotation-form-input" value="${activeViewText}">
      <label for="category" class="styling-form-label">Category</label>
      <div class="styling-form-select-plus-add"></div>
      <label for="name" class="styling-form-label">Annotation</label>
      <input type="text" id="annotation-form-name" class="styling-form-input annotation-form-input" name="name">
      <span id="styling-form-warning" class="styling-form-warning hidden"></span>
      <input type="submit" value="Create" class="styling-form-submit">
    </form>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>