<template>
  <div class="my-recipes-page">
    <h1>My Recipes</h1>

    <!-- Button to open modal -->
    <div class="text-end mb-3">
      <button class="btn btn-success" @click="showModal = true">Add Recipe</button>
    </div>
    <!-- Recipe creation modal -->

    <RecipeModal v-model="showModal" @recipe-created="handleSuccess" />

    <!-- Loading / empty / recipe list -->
    <div v-if="loading">Loading your recipes...</div>
    <div v-else-if="recipes.length === 0">
      You haven't created any recipes yet.
    </div>
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
import { ref, onMounted } from "vue";
import RecipeModal from "@/components/RecipeModal.vue";

export default {
  name: "MyRecipes",
  components: {
    RecipeModal,
  },
  setup() {
    const recipes = ref([]);
    const loading = ref(true);
    const showModal = ref(false);

    // Load recipes from backend
    const loadRecipes = async () => {
      try {
        const response = await window.axios.get("/users/myRecipes");
        recipes.value = response.data;
      } catch (err) {
        console.error("API error:", err.response);
        window.toast(
          "Failed to load your recipes",
          err.response?.data?.message || "Unknown error",
          "danger"
        );
      } finally {
        loading.value = false;
      }
    };

    // When recipe is added successfully, hide modal and refresh
    const handleSuccess = () => {
      showModal.value = false;
      loadRecipes();
    };

    onMounted(loadRecipes);

    return { recipes, loading, showModal, handleSuccess };
  },
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
