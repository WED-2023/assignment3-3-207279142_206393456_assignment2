<template>
  <div class="container">

    <!-- Grid row: Left = recipes, Right = login / last viewed -->
    <div class="row">
      <!-- Left: Recipes list -->
      <div class="col-12 col-md-6 d-flex flex-column align-items-center">
        <RecipePreviewList
          title="Random Recipes"
          class="RandomRecipes"
          :recipes="randomRecipes"
        />
        <button class="btn btn-outline-primary mt-3" @click="fetchRandomRecipes">More</button>
      </div>
      <!-- Right: login form or last viewed -->
      <div class="col-12 col-md-6 d-flex justify-content-center">
        <div v-if="!store.username" class="login-wrapper">
          <InlineLogin />
        </div>

        <RecipePreviewList
          v-else
          title="Last Viewed Recipes"
          :recipes="lastViewed"
          class="RandomRecipes"
        />
      </div>

    </div>

    <!-- Message for guests who are not logged in -->
    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-primary">You need to Login to view this</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import InlineLogin from "@/components/InlineLogin.vue";
import axios from 'axios';

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
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
.row > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login-wrapper {
  margin-top: -500px; /* Adjust how much you want to lift it */
}

</style>
