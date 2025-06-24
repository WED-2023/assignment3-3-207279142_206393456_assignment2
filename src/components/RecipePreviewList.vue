<!-- <template>
  <b-container>
    <h2 class="list-title">
      {{ title }}
      <slot></slot>
    </h2>
    <div v-if="gridMode" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview
          class="recipePreview"
          :recipe="r"
          :was-viewed="r.wasViewed"
        />
      </div>
    </div>

    <div v-else class="grid-recipes">
      <RecipePreview
        v-for="r in recipes"
        :key="r.id"
        :class="['recipePreview', $attrs.class]"
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
    gridMode: {
      type: Boolean,
      default: false,
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

.list-title {
  font-size: 2.6rem;
  font-weight: 800;
  text-align: center;
  color: #000000;
  margin: 40px 0 30px;
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.list-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #9ae0f1, #d6a3e6);
  margin: 12px auto 0;
  border-radius: 2px;
}
.recipePreview.preview-home {
  width: 100%;
  max-width: 1000px; 
  margin: auto;
}



</style> -->


<template>
  <b-container class="preview-container">
  <!-- <div class="refresh-button-wrapper">
      <button class="refresh-button" @click="$emit('refresh-random')" title="Show other recipes">⋯</button>
    </div> -->

    <h2 class="list-title">
      {{ title }}
      <slot></slot>
    </h2>
    <!-- <button class="refresh-button" @click="$emit('refresh-random')" title="Show other recipes">⋯</button>

    <div v-if="gridMode" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview
          class="recipePreview"
          :recipe="r"
          :was-viewed="r.wasViewed"
        />
      </div>
    </div> -->

    <!-- <div v-else class="grid-recipes">
      <RecipePreview
        v-for="r in recipes"
        :key="r.id"
        :class="['recipePreview', $attrs.class]"
        :recipe="r"
        :was-viewed="r.wasViewed"
      />
    </div> -->
    <div class="recipes-wrapper">
      <button
        v-if="showRefresh"
        class="refresh-button"
        @click="$emit('refresh-random')"
        title="Show other recipes"
      >⋯</button>

      <div v-if="gridMode" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <div class="col" v-for="r in recipes" :key="r.id">
          <RecipePreview
            class="recipePreview"
            :recipe="r"
            :was-viewed="r.wasViewed"
          />
        </div>
      </div>

      <div v-else class="grid-recipes">
        <RecipePreview
          v-for="r in recipes"
          :key="r.id"
          :class="['recipePreview', $attrs.class]"
          :recipe="r"
          :was-viewed="r.wasViewed"
        />
      </div>
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
    gridMode: {
      type: Boolean,
      default: false,
    },
    recipes: {
      type: Array,
      required: true,
    },
    showRefresh: {
      type: Boolean,
      default: false,
    },
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
.list-title {
  font-size: 2.6rem;
  font-weight: 800;
  text-align: center;
  color: #000000;
  margin: 40px 0 30px;
  position: relative;
  // font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 1px;
  text-transform: none;
  font-family: 'Pacifico', cursive;

}
.list-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #9ae0f1, #b3efe5);
  margin: 12px auto 0;
  border-radius: 2px;
}
.recipePreview.preview-home {
  width: 100%;
  max-width: 1000px;
  margin: auto;
}


.refresh-button {
  position: absolute;
  top: -50px;
  right: 10px;
  font-size: 3rem;
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 4px 10px;
  z-index: 2;
  transition: transform 0.2s ease;
}
.refresh-button:hover {
  transform: scale(1.1);
  color: #000;
}
.preview-container {
  position: relative;
}
.recipes-wrapper {
  position: relative;
}

</style>
