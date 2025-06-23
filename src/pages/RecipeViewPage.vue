<template>
  <div
    class="recipe-page"
    v-if="recipe"
    :style="{ backgroundImage: `url(${recipe.image})` }">
      <div class="container">
        <div class="recipe-header mt-3 mb-4">
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
                <!-- Family recipe info -->
                <div v-if="recipe.family_owner" class="mt-3">
                  <h5>Family Recipe Details:</h5>
                  <ul>
                    <li><strong>Cooked by:</strong> {{ recipe.family_owner }}</li>
                    <li><strong>When it's made:</strong> {{ recipe.family_event }}</li>
                  </ul>
                </div>

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
      </div>
  </div>
</template>
  
  <script>

  export default {
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
          glutenFree: response.data.glutenFree,
          family_owner: response.data.family_owner,
          family_event: response.data.family_event        };


        this.likes = popularity;
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
  font-size: 1.2rem;
  transition: all 0.2s ease;
  font-weight: bold;
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

.recipe-page {
  position: relative;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  font-size: 2rem;
  color: #111;
}

.recipe-body {
  font-size: 1.1rem;
  color: #222;
  line-height: 1.6;
}
.recipe-page::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.6); 
  z-index: 0;
}

.recipe-page > * {
  position: relative;
  z-index: 1;
}
.like-btn {
  background: none;
  border: none;
  font-size: 1ץ7rem; 
  font-weight: bold; 
  cursor: pointer;
  margin-left: 8px;
  color: #000;
}
.like-btn:hover {
  opacity: 0.7;
}
  /* .recipe-header{
  
  } */
  </style>
  