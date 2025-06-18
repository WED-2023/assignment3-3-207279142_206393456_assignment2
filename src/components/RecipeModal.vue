<template>
    <b-modal
      id="recipe-modal"
      title="Add New Recipe"
      hide-footer
      @hide="resetForm"
      v-model="isVisible"
    >
    <RecipeForm
      ref="recipeForm"
      :defaultIsFamily="defaultIsFamily"
      @submitted="handleSuccess"
    />
    </b-modal>
  </template>
  
  <script>
  import RecipeForm from "./RecipeForm.vue";
  
  export default {
    name: "RecipeModal",
    components: {
      RecipeForm,
    },
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
      defaultIsFamily: {
        type: Boolean,
        default: false
      }
    },
    emits: ["update:modelValue", "recipe-created"],
    computed: {
      isVisible: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit("update:modelValue", value);
        },
      },
    },
    methods: {
      handleSuccess() {
        this.isVisible = false;
        this.$emit("recipe-created");
      },
      resetForm() {
        this.$refs.recipeForm?.reset?.();
      },
    },
  };
  </script>
  