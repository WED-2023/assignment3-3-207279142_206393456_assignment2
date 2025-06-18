<template>
    <div class="favorites-page">
      <h1>My Favorite Recipes</h1>
  
      <div v-if="loading">Loading favorites...</div>
      <div v-else-if="recipes.length === 0">
        You have no favorite recipes yet.
      </div>
      <div v-else class="recipe-list">
        <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
          <h3>{{ recipe.title }}</h3>
          <img v-if="recipe.image" :src="recipe.image" alt="Recipe image" width="200" />
          <p>Ready in: {{ recipe.readyInMinutes }} minutes</p>
          <p>Likes: {{ recipe.aggregateLikes }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'MyFavoritesPage',
    setup() {
      const recipes = ref([]);
      const loading = ref(true);
  
      onMounted(async () => {
        try {
          const response = await window.axios.get('/users/favorites');
          recipes.value = response.data;
        } catch (err) {
          console.error("Failed to load favorites:", err);
          window.toast("Failed to load favorite recipes", err.response?.data?.message || "Unknown error", "danger");
        } finally {
          loading.value = false;
        }
      });
  
      return { recipes, loading };
    }
  };
  </script>
  
  <style scoped>
  .favorites-page {
    max-width: 800px;
    margin: auto;
  }
  .recipe-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
  }
  </style>
  