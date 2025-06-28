<template>
  <div class="my-recipes-page">
    <!-- Recipe creation modal -->

    <RecipeModal v-model="showModal" @recipe-created="handleSuccess" />

    <!-- Loading / empty / recipe list -->
    <div v-if="loading">Loading your recipes...</div>
    <div v-else-if="recipes.length === 0" class="no-recipes-message">
      You haven't created any recipes yet.
    </div>
    <RecipePreviewList v-else title="My Recipes" :recipes="recipes" :gridMode="true" />

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import RecipePreviewList from "@/components/RecipePreviewList.vue";

export default {
  name: "MyRecipes",
  components: {
    RecipePreviewList,

  },
  setup() {
    const recipes = ref([]);
    const loading = ref(true);

    // Load recipes from backend
    const loadRecipes = async () => {
      try {
        const response = await window.axios.get("/users/myRecipes");
        recipes.value = response.data.map(r => ({
          ...r,
          id: r.recipe_id || r.id
        }));
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

    onMounted(loadRecipes);

    return { recipes, loading };
  },
};
</script>

<style scoped>
.my-recipes-page {
  max-width: 800px;
  margin: auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;

}

.recipe-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}
.no-recipes-message {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 500;
  color: #666;
  padding: 40px 20px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  margin-top: 30px;
}

</style>
