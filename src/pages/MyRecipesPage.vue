<template>
    <div class="my-recipes-page">
      <h1>My Recipes</h1>
      <div class="text-end mb-3">
        <button class="btn btn-success" @click="goToAddRecipe">Add Recipe</button>
      </div>
      <div v-if="loading">Loading your recipes...</div>
      <div v-else-if="recipes.length === 0">You haven't created any recipes yet.</div>
      <div v-else class="recipe-list">
        <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
          <h3>{{ recipe.title }}</h3>
          <img :src="recipe.image" alt="Recipe image" v-if="recipe.image" />
          <p>Ready in: {{ recipe.readyInMinutes }} min</p>
          <p>Servings: {{ recipe.servings }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    name: "MyRecipes",
    setup() {
      const recipes = ref([]);
      const loading = ref(true);
      const goToAddRecipe = () => {
        window.router.push('/add-recipe');
      };

      onMounted(async () => {
        try {
          const response = await window.axios.get("/users/myRecipes");
          recipes.value = response.data;
        } catch (err) {
            console.error("API error:", err.response); 
            console.error("Failed to fetch recipes:", err);
            window.toast("Failed to load your recipes", err.response?.data?.message || "Unknown error", "danger");
        } finally {
          loading.value = false;
        }
      });
  
      return { recipes, loading, goToAddRecipe};
    }
  };
  </script>
  
  <style scoped>
  .my-recipes-page {
    max-width: 800px;
    margin: auto;
  }
  
  .recipe-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
  }
  </style>
  