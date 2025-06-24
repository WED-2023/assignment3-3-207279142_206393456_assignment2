<template>
    <div class="my-family-page container">  
  
      <div v-if="loading">Loading...</div>
  
      <RecipePreviewList
        v-else
        title="Family Recipes"
        :recipes="recipes"
        :gridMode="true"
      />

    </div>
  </template>
  
  <script>
  import { ref, onMounted, getCurrentInstance } from "vue";
  import RecipePreviewList from "@/components/RecipePreviewList.vue";
  
  export default {
    name: "MyFamilyPage",
    components: {
      RecipePreviewList,
    },
    setup() {
      const internalInstance = getCurrentInstance();
      const store = internalInstance.appContext.config.globalProperties.store;
  
      const recipes = ref([]);
      const loading = ref(true);
  
      const loadFamilyRecipes = async () => {
        try {
          const response = await window.axios.get("/users/myFamily");
          recipes.value = response.data.map(r => ({
            ...r,
            id: r.recipe_id || r.id
          }));
        } catch (err) {
          console.error("Failed to load family recipes:", err);
          window.toast("Error", "Could not load family recipes", "danger");
        } finally {
          loading.value = false;
        }
      };
  
  
      onMounted(loadFamilyRecipes);
  
      return { store, recipes, loading};
    },
  };
  </script>
  
  <style scoped>
  .my-family-page {
    max-width: 800px;
    margin: auto;
    font-family: Avenir, Helvetica, Arial, sans-serif;

  }
  </style>
  