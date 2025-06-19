<template>
  <div class="card h-100" :class="{ 'family-recipe': recipe.family_owner }">
    <!-- Clicking image or title navigates to recipe -->
    <router-link
      :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      class="text-decoration-none text-dark"
    >
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        alt="Recipe image"
      />
      <div class="card-body text-center">
        <h5 class="card-title">{{ recipe.title }}</h5>
      </div>
    </router-link>

    <!-- Rest of the info (not clickable) -->
    <div class="card-body text-center pt-0">
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text">
        Popularity: {{ likes }}
      </p>

      <div class="diet-labels d-flex justify-content-center gap-3 mt-2">
        <span :class="['badge-label', recipe.vegetarian ? 'active' : 'inactive']">
          🥦 <small>Vegetarian</small>
        </span>
        <span :class="['badge-label', recipe.vegan ? 'active' : 'inactive']">
          🌱 <small>Vegan</small>
        </span>
        <span :class="['badge-label', recipe.glutenFree === 0 ? 'active' : 'inactive']">
          🌾 <small>Gluten Free</small>
        </span>
      </div>

      <p v-if="recipe.family_owner" class="card-text">
        Family Recipe by {{ recipe.family_owner }} ({{ recipe.family_event }})
      </p>

      <!-- Favorite Button (outside router-link!) -->
      <button @click.stop="toggleFavorite" class="favorite-btn">
        <span :class="{ filled: isFavorite }">❤</span>
      </button>
      <!-- Like Button (outside router-link!) -->
      <button @click.stop="likeRecipe" class="like-btn">
        👍 {{ likes }}
      </button>

    </div>
  </div>
</template>


<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFavorite: false,
      likes: this.recipe.popularity ?? 0,
      hasLiked: false
    };
  },
  async mounted() {
    try {
      const favs = await this.$root.axios.get("/users/favorites");
      const favIds = favs.data.map(r => r.recipe_id || r.id);
      this.isFavorite = favIds.includes(this.recipe.id);
    } catch (err) {
      console.error("Failed to check favorites:", err);
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
        await this.$root.axios.post("/users/favorites", {
          recipeId: this.recipe.id
        });
        this.isFavorite = true;
        this.$root.toast("Success", "Added to favorites", "success");
      } catch (err) {
        console.error("Failed to favorite recipe:", err);
        this.$root.toast("Error", "Could not add to favorites", "danger");
      }
    },
    async likeRecipe() {
      if (this.hasLiked) {
        return;
      }
      try {
        await this.$root.axios.put(`/recipes/${this.recipe.id}/like`);
        this.likes += 1; 
        this.hasLiked = true;
      } catch (err) {
        console.error("Failed to like recipe:", err);
        this.$root.toast("Error", "Could not like recipe", "danger");
      }
    }


  }
};

</script>

<style scoped>
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 8px;
}

.favorite-btn span {
  color: #aaa;
  transition: color 0.3s ease;
}

.favorite-btn span.filled {
  color: red;
}

.text-decoration-none {
  text-decoration: none;
}
.text-dark {
  color: inherit;
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
.like-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 8px;
  color: gray;
}

.like-btn:hover {
  text-decoration: none;
  opacity: 0.8;
}


</style>
