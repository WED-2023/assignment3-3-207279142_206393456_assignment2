<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <!-- Show "Add Recipe" button and modal only if user is logged in -->
    <div v-if="store.username" class="text-end mb-3">
      <b-button variant="primary" @click="showModal = true">+ Add Recipe</b-button>
      <RecipeModal v-model="showModal" @recipe-created="handleRecipeCreated" />
    </div>

    <!-- Random recipes section -->
    <RecipePreviewList
      title="Random Recipes"
      class="RandomRecipes center"
      :recipes="randomRecipes"
    />
    <div class="text-center">
      <button class="btn btn-outline-secondary" @click="fetchRandomRecipes">More</button>
    </div>


    <!-- Message for guests who are not logged in -->
    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-primary">You need to Login to view this</button>
      </router-link>
    </div>

    <!-- Last viewed recipes (blurred for guests) -->
    <RecipePreviewList
      title="Last Viewed Recipes"
      :recipes="lastViewed"
      :class="{
        RandomRecipes: true,
        blur: !store.username,
        center: true
      }"
    />

  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import RecipeModal from "@/components/RecipeModal.vue";
import axios from 'axios';

export default {
  components: {
    RecipePreviewList,
    RecipeModal
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const showModal = ref(false);
    const randomRecipes = ref([]);
    const lastViewed = ref([]);

    onMounted(async () => {
      if (store.username) {
        try {
          const response = await axios.get("/users/lastWatched", {
            withCredentials: true
          });
          console.log("Fetched watched recipes:", response.data);

          lastViewed.value = response.data.map(recipe => ({
            ...recipe,
            wasViewed: true
          }));
        } catch (err) {
          console.error("Failed to fetch last watched recipes:", err);
        }
      }
      await fetchRandomRecipes();

    });
    const handleRecipeCreated = () => {
      showModal.value = false;
    };
    const fetchRandomRecipes = async () => {
      try {
        const response = await axios.get("/recipes/random", {

          withCredentials: true
        });
        randomRecipes.value = response.data;
      } catch (error) {
        console.error("Failed to fetch random recipes:", error);
      }
    };

    return { store, showModal, handleRecipeCreated ,  randomRecipes, lastViewed, fetchRandomRecipes };
  }
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px);
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style>
