<template>
  <b-container>
    <h3>
      {{ title }}:
      <slot></slot>
    </h3>
    <div class="grid-recipes">
      <RecipePreview
        v-for="r in recipes"
        :key="r.id"
        class="recipePreview"
        :recipe="r"
        :was-viewed="r.wasViewed"
      />
    </div>

  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      required: true,
    },
    
  },
  mounted() {
      console.log("recipes from parent:", this.recipes);
    },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
.grid-recipes {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 1000px;
  overflow-y: auto;
  padding-right: 5px;
}



.recipePreview {
  aspect-ratio: 1 / 1;
}

</style>
