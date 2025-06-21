<template>
  <div class="card h-100" :class="{ 'family-recipe': recipe.family_owner }">
    <!-- Clicking image or title navigates to recipe -->
    <router-link
      :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      class="text-decoration-none text-dark">
      <div class="image-wrapper">
        <img v-if="recipe.image" :src="recipe.image" class="card-img-top recipe-image" alt="Recipe image"/>

        <!-- Eye icon positioned on top of the image -->
        <i
          :class="[
            'bi',
            wasViewedLocal ? 'bi-eye-fill' : 'bi-eye-slash-fill',
            'viewed-icon-absolute'
          ]"
          :title="wasViewedLocal ? 'Already viewed' : 'Not viewed yet'"
        ></i>

        <div class="image-overlay">To view the recipe</div>
      </div>


      <div class="card-body text-center">
        <h5 class="card-title d-flex justify-content-center align-items-center gap-2">
          {{ recipe.title }}

        </h5>
      </div>
    </router-link>

    <!-- Rest of the info (not clickable) -->
    <div class="card-body text-center pt-0">
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>


      <div class="diet-labels d-flex justify-content-center gap-3 mt-2">
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
    },
    wasViewed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFavorite: false,
      likes: this.recipe.popularity ?? 0,
      hasLiked: false,
      wasViewedLocal: false 
    };
  },
  async mounted() {
    try {
      const favs = await this.$root.axios.get("/users/favorites");
      const favIds = favs.data.map(r => r.recipe_id || r.id);
      this.isFavorite = favIds.includes(this.recipe.id);
      const viewed = await this.$root.axios.get("/users/lastWatched");
      const viewedIds = viewed.data.map(r => r.recipe_id || r.id);
      this.wasViewedLocal = viewedIds.includes(this.recipe.id);
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
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.image-wrapper:hover .recipe-image {
  transform: scale(1.03);
  opacity: 0.7;
}
.recipe-image:hover {
  transform: scale(1.03);
  opacity: 0.9;
}
.image-overlay {
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  width: 100%;
  text-align: center;
  padding: 8px;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.image-wrapper:hover .image-overlay {
  opacity: 1;
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

.preview-wrapper {
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.viewed-icon-absolute {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 2;
  font-size: 1rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.viewed-icon-absolute.bi-eye-fill {
  color: white;
}
.viewed-icon-absolute.bi-eye-slash-fill {
  color: white;
}
</style>
