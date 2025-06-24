
<template>
  <div>
    <div v-if="store.username" class="container homepage-container">
      <div class="row justify-content-center">
        <!-- Left side: Random Recipes -->
        <div class="col-12 col-md-6 mb-4">
          <RecipePreviewList
            title="Random Recipes"
            :recipes="randomRecipes"
            class="preview-home"
            @refresh-random="fetchRandomRecipes"
            :showRefresh="true"
          />


          <div class="text-center mt-2">
            <button class="btn btn-outline-primary" @click="fetchRandomRecipes">More</button>
          </div>
        </div>

        <!-- Right side: Last Viewed -->
        <div class="col-12 col-md-6 mb-4">
          <RecipePreviewList
            title="Last Viewed Recipes"
            :recipes="lastViewed"
            class="preview-home"
          />
        </div>
      </div>
    </div>

    <!-- Guest view -->
    <div v-else class="container homepage-container">
      <div class="row justify-content-center">
        <!-- Left: Random Recipes -->
        <div class="col-12 col-md-6 mb-4">
          <RecipePreviewList
            title="Random Recipes"
            :recipes="randomRecipes"
            class="preview-home"
            @refresh-random="fetchRandomRecipes"
            :showRefresh="true"
          />

        </div>

        <!-- Right: Login Form -->
        <div class="col-12 col-md-6 d-flex justify-content-center align-items-start mb-4">
          <div style="width: 100%;">
            <InlineLogin />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance } from 'vue';
import axios from 'axios';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import InlineLogin from "@/components/InlineLogin.vue";

export default {
  components: {
    RecipePreviewList,
    InlineLogin
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const showModal = ref(false);
    const randomRecipes = ref([]);
    const lastViewed = ref([]);

    const fetchRandomRecipes = async () => {
      try {
        const response = await axios.get("/recipes/random", {
          withCredentials: true
        });
        randomRecipes.value = response.data.slice(0, 3);
      } catch (error) {
        console.error("Failed to fetch random recipes:", error);
      }
    };

    const handleRecipeCreated = () => {
      showModal.value = false;
    };

    onMounted(async () => {
      if (store.username) {
        try {
          const response = await axios.get("/users/lastWatched", {
            withCredentials: true
          });
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

    return {
      store,
      showModal,
      handleRecipeCreated,
      randomRecipes,
      lastViewed,
      fetchRandomRecipes
    };
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

.row > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button.btn-link.fs-3 {
  text-decoration: none;
  font-weight: bold;
}
button.btn-link.fs-3:hover {
  color: #555;
  transform: scale(1.1);
}
</style>
