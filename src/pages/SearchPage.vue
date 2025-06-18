<template>
  <div class="container">
    <h1 class="title">Search Page</h1>

    <!-- Show "Add Recipe" button and modal only if user is logged in -->
    <div v-if="store.username" class="text-end mb-3">
      <b-button variant="primary" @click="showModal = true">+ Add Recipe</b-button>
      <RecipeModal v-model="showModal" @recipe-created="handleRecipeCreated" />
    </div>
  </div>
</template>

<script>
import RecipeModal from "@/components/RecipeModal.vue";
import { ref, getCurrentInstance } from "vue";

export default {
  components: {
    RecipeModal,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    const showModal = ref(false);

    const handleRecipeCreated = () => {
      showModal.value = false;
    };

    return { store, showModal, handleRecipeCreated };
  },
};
</script>
