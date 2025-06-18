<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <!-- Show "Add Recipe" button and modal only if user is logged in -->
    <div v-if="store.username" class="text-end mb-3">
      <b-button variant="primary" @click="showModal = true">+ Add Recipe</b-button>
      <RecipeModal v-model="showModal" @recipe-created="handleRecipeCreated" />
    </div>

    <!-- Random recipes section -->
    <RecipePreviewList title="Random Recipes" class="RandomRecipes center" />

    <!-- Message for guests who are not logged in -->
    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-primary">You need to Login to view this</button>
      </router-link>
    </div>

    <!-- Last viewed recipes (blurred for guests) -->
    <RecipePreviewList
      title="Last Viewed Recipes"
      :class="{
        RandomRecipes: true,
        blur: !store.username,
        center: true
      }"
      disabled
    />
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import RecipeModal from "@/components/RecipeModal.vue";

export default {
  components: {
    RecipePreviewList,
    RecipeModal
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const showModal = ref(false);

    const handleRecipeCreated = () => {
      showModal.value = false;
    };

    return { store, showModal, handleRecipeCreated };
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
