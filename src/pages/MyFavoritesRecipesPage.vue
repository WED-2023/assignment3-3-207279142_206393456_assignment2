<template>
    <div class="favorites-page">
      <div v-if="loading">Loading favorites...</div>
      <div v-else-if="recipes.length === 0">
        You have no favorite recipes yet.
      </div>
      <!-- <RecipePreviewList v-else title="My Favorites" :recipes="recipes" /> -->
      <RecipePreviewList v-else title="My Favorites" :recipes="recipes" :gridMode="true" />

    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import RecipePreviewList from "@/components/RecipePreviewList.vue";

  export default {
    name: 'MyFavoritesPage',
    components: {
      RecipePreviewList,
    },
    setup() {
      const recipes = ref([]);
      const loading = ref(true);
      const showModal = ref(false);

      const handleRecipeCreated = () => {
        showModal.value = false;
      };

      onMounted(async () => {
        try {
          const response = await window.axios.get('/users/favorites');
          console.log("Loaded favorites:", response.data); // ← מוסיפים את זה
          recipes.value = response.data.map(r => ({
            ...r,
            id: r.recipe_id || r.id,
            ingredients: r.ingredients ?? [],
            instructions: r.instructions ?? ""
          }));

        } catch (err) {
          console.error("Failed to load favorites:", err);
          window.toast("Failed to load favorite recipes", err.response?.data?.message || "Unknown error", "danger");
        } finally {
          loading.value = false;
        }
      });
  
      return { showModal,recipes, loading , handleRecipeCreated};
    }
  };
  </script>
  
  <style scoped>
  .favorites-page {
    max-width: 800px;
    margin: auto;
    font-family: Avenir, Helvetica, Arial, sans-serif;

  }
  .recipe-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
  }
  </style>
  