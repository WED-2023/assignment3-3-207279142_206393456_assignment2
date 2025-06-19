<template>
    <div class="container">
      <div v-if="recipe">
        <div class="recipe-header mt-3 mb-4">
          <b-button variant="primary" @click="showModal = true">+ Add Recipe</b-button>
          <RecipeModal v-model="showModal" @recipe-created="handleRecipeCreated" />
          <h1>{{ recipe.title }}</h1>
          <img :src="recipe.image" class="center" />
          <!-- Favorite Button -->
          <button @click="toggleFavorite" class="favorite-btn">
            <span :class="{ filled: isFavorite }">❤</span>
          </button>
          <!-- Like Button -->
          <button @click="likeRecipe" class="like-btn">
            👍 {{ likes }}
          </button>

        </div>
        <div class="recipe-body">
          <div class="wrapper">
            <div class="wrapped">
              <div class="mb-3">
                <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
                <div>Servings: {{ recipe.servings }}</div>
                <div class="diet-labels d-flex gap-2 mt-2">
                  <span :class="['badge-label', recipe.vegetarian ? 'active' : 'inactive']">
                    🥦 <small>Vegetarian</small>
                  </span>
                  <span :class="['badge-label', recipe.vegan ? 'active' : 'inactive']">
                    🌱 <small>Vegan</small>
                  </span>
                  <span :class="['badge-label', recipe.glutenFree ? 'active' : 'inactive']">
                    🌾 <small>Gluten Free</small>
                  </span>
                </div>

                <!-- <div>Likes: {{ recipe.aggregateLikes }} likes</div> -->
                <div>Likes: {{ likes }} likes</div>

              </div>
              Ingredients:
              <ul>
                <li v-for="(ing, index) in recipe.ingredients" :key="index"> {{ ing.name }} – {{ ing.quantity }}
                </li>
              </ul>
            </div>
            <div class="wrapped">
              Instructions:
              <ol>
                <li v-for="(step, index) in recipe.instructions" :key="index" v-html="step"></li>


              </ol>
            </div>
          </div>
        </div>
        <!-- <pre>
        {{ $route.params }}
        {{ recipe }}
      </pre
        > -->
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import RecipeModal from "@/components/RecipeModal.vue";

  export default {
    components: {
      RecipeModal,
    },
    setup() {
      const showModal = ref(false);

      const handleRecipeCreated = () => {
        showModal.value = false;
      };

      return { showModal, handleRecipeCreated };
    },
    data() {
      return {
        recipe: null,
        isFavorite: false,
        likes: 0,
        hasLiked: false
      };
    },
    async created() {
      try {
        const response = await this.axios.get(`/recipes/${this.$route.params.recipeId}`);
        const {
          instructions,
          extendedIngredients,
          popularity,
          readyInMinutes,
          image,
          title,
          servings
        } = response.data;

        if (response.status !== 200) this.$router.replace("/NotFound");
        this.recipe = {
          instructions,
          ingredients: response.data.ingredients ?? extendedIngredients,
          popularity,
          readyInMinutes,
          image,
          title,
          servings,
          vegetarian: response.data.vegetarian,
          vegan: response.data.vegan,
          glutenFree: response.data.glutenFree
        };

        this.likes = popularity;



        // const _instructions = analyzedInstructions
        //   .map((fstep) => {
        //     fstep.steps[0].step = fstep.name + fstep.steps[0].step;
        //     return fstep.steps;
        //   })
        //   .reduce((a, b) => [...a, ...b], []);
  
        // this.recipe = {
        //   _instructions,
        //   _instructions,
        //   analyzedInstructions,
        //   extendedIngredients,
        //   aggregateLikes,
        //   readyInMinutes,
        //   image,
        //   title
        // };
  
        // Check if this recipe is already a favorite
        const favRes = await this.axios.get("/users/favorites");
        const favoriteIds = favRes.data.map(r => r.recipe_id || r.id);
        this.isFavorite = favoriteIds.includes(+this.$route.params.recipeId);
        // Mark recipe as watched if user is logged in
        if (this.$root.store.username) {
          await this.axios.post("/users/viewed", {
            recipeId: this.$route.params.recipeId
          },
          { withCredentials: true });
        }

      } catch (error) {
        console.error("Failed to fetch recipe", error);
        this.$router.replace("/NotFound");
      }
    },
    methods: {
      async toggleFavorite() {
        if (!this.$root.store.username) {
          this.$root.toast("Login Required", "Please log in to add favorites", "warning");
          return;
        }
        if (this.isFavorite) {
          this.$root.toast("Already Favorited", "This recipe is already in favorites", "info");
          return;
        }
        try {
          await this.axios.post("/users/favorites", {
            recipeId: this.$route.params.recipeId
          });
          this.isFavorite = true;
          this.$root.toast("Success", "Added to favorites", "success");
        } catch (err) {
          console.error("Favorite failed", err);
          this.$root.toast("Error", err.response?.data?.message || "Failed to favorite", "danger");
        }
      },
      async likeRecipe() {
        if (this.hasLiked) return;

        try {
          await this.axios.put(`/recipes/${this.$route.params.recipeId}/like`);
          this.likes += 1;
          this.hasLiked = true;
          this.$root.toast("Thanks!", "You liked this recipe", "success");
        } catch (err) {
          console.error("Failed to like recipe:", err);
          this.$root.toast("Error", "Could not like recipe", "danger");
        }
      }

    }
  };
  </script>
    
  <style scoped>
  .wrapper {
    display: flex;
  }
  .wrapped {
    width: 50%;
  }
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
  .favorite-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  margin-top: 10px;
}

.favorite-btn span {
  color: #aaa;
  transition: color 0.3s ease;
}

.favorite-btn span.filled {
  color: red;
}
.diet-labels {
  flex-wrap: wrap;
}

.badge-label {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.badge-label small {
  margin-left: 5px;
}

.badge-label.active {
  background-color: #e6f7e6;
  color: #1b5e20;
  font-weight: 600;
}

.badge-label.inactive {
  background-color: #f0f0f0;
  color: #999;
  font-weight: 400;
}

  /* .recipe-header{
  
  } */
  </style>
  