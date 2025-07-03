<template>
  <b-container class="preview-container">
    <h2 class="list-title">
      {{ title }}
      <slot></slot>
    </h2>

    <div class="recipes-wrapper">
      <button
        v-if="showRefresh"
        class="refresh-button"
        @click="$emit('refresh-random')"
        title="Show other recipes"
      >Click for more</button>

      <div v-if="gridMode">
        <div
          v-if="$attrs.class === 'family-mode'"
          class="family-grid"
        >
          <RecipePreview
            v-for="r in recipes"
            :key="r.id"
            class="recipePreview family-preview"
            :recipe="r"
            :was-viewed="r.wasViewed"
          />
        </div>

        <div
          v-else
          class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4"
        >
          <div class="col" v-for="r in recipes" :key="r.id">
            <RecipePreview
              class="recipePreview"
              :recipe="r"
              :was-viewed="r.wasViewed"
            />
          </div>
        </div>
      </div>



      <div v-else class="grid-recipes">
        <RecipePreview
          v-for="r in recipes"
          :key="r.id"
          :class="[
            'recipePreview',
            r.family_owner && $attrs.class === 'family-mode' ? 'family-preview' : '',
            $attrs.class
          ]"
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
    mounted() {
      this.markViewedRecipes();
    },
    methods: {
      async markViewedRecipes() {
        try {
          const viewedIds = await this.$root.axios.get("/users/viewedIds")
            .then(res => res.data);
            this.recipes.forEach((recipe, index) => {
              const isViewed = viewedIds.includes(recipe.recipe_id || recipe.id);
              this.$set(this.recipes, index, {
                ...recipe,
                wasViewed: isViewed
              });
            });

        } catch (err) {
          console.error("❌ Failed to fetch viewed recipe IDs:", err);
        }
      }
    }
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
    top: -40px;
    right: 10px;
    font-size: 1rem;
    background: none;
    border:2px solid #b3efe5;
    color: #000;
    cursor: pointer;
    padding: 6px 12px;
    z-index: 2;
    transition: all 0.3s ease;
    border-radius: 8px;

  }
  .refresh-button:hover {
    transform: scale(1.1);
    color: #000;
    transition: all 0.3s ease;

  }
  .preview-container {
    position: relative;
  }
  .recipes-wrapper {
    position: relative;
    font-family: Avenir, Helvetica, Arial, sans-serif;

  }
  .family-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    margin-top: 20px;
  }

  .family-row .col {
    flex: 0 0 32%;
    max-width: 32%;
  }

  .family-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 30px;
    justify-items: center;
  }

  .family-preview .card {
    width: 100%;
    max-width: 1000px;
    min-height: 580px;
    background-color: rgba(255,255,255,0.85);
    border: 2px solid black;
    padding: 20px;


  }

</style>