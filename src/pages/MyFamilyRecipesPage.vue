<template>
    <div class="my-family-page container">
      <h1>My Family Recipes</h1>
  
      <!-- Add Recipe button -->
      <div v-if="store.username" class="text-end mb-3">
        <b-button variant="success" @click="showModal = true">+ Add Family Recipe</b-button>
        <RecipeModal v-model="showModal" @recipe-created="handleRecipeCreated" />
      </div>
  
      <div v-if="loading">Loading...</div>
  
      <RecipePreviewList
        v-else
        title="Family Recipes"
        :recipes="recipes"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, getCurrentInstance } from "vue";
  import RecipeModal from "@/components/RecipeModal.vue";
  import RecipePreviewList from "@/components/RecipePreviewList.vue";
  
  export default {
    name: "MyFamilyPage",
    components: {
      RecipeModal,
      RecipePreviewList,
    },
    setup() {
      const internalInstance = getCurrentInstance();
      const store = internalInstance.appContext.config.globalProperties.store;
  
      const recipes = ref([]);
      const loading = ref(true);
      const showModal = ref(false);
  
      const loadFamilyRecipes = async () => {
        try {
          const response = await window.axios.get("/users/myFamily");
          recipes.value = response.data;
        } catch (err) {
          console.error("Failed to load family recipes:", err);
          window.toast("Error", "Could not load family recipes", "danger");
        } finally {
          loading.value = false;
        }
      };
  
      const handleRecipeCreated = () => {
        showModal.value = false;
        loadFamilyRecipes();
      };
  
      onMounted(loadFamilyRecipes);
  
      return { store, recipes, loading, showModal, handleRecipeCreated };
    },
  };
  </script>
  
  <style scoped>
  .my-family-page {
    max-width: 800px;
    margin: auto;
  }
  </style>
  