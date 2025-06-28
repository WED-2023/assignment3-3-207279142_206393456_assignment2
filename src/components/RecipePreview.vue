<template>
<div :class="['card', 'h-100', recipe.family_owner ? 'family-preview-card' : '']">

    <router-link
      :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      class="text-decoration-none text-dark full-link">
      <div class="image-overlay">To view the recipe</div>
    </router-link>

    
    <div class="image-wrapper">
      <router-link
        :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
        class="text-decoration-none text-dark">
        <img
          v-if="recipe.image"
          :src="recipe.image"
          alt="Recipe image"
          class="recipe-image"
        />
      </router-link>
      <!-- Eye icon at top-right -->
      <i
        :class="[
          'bi',
          wasViewedLocal ? 'bi-eye-fill' : 'bi-eye-slash-fill',
          'viewed-icon-absolute'
        ]"
        :title="wasViewedLocal ? 'Already viewed' : 'Not viewed yet'"
      ></i>

      <!-- Heart icon at top-left -->
      <button @click.stop="toggleFavorite"
        :class="['favorite-icon-simple', { filled: isFavorite }]">
        ❤
      </button>

    </div>
    <!-- Text overlay container --> 
    <div class="text-overlay">
      <h5 class="card-title d-flex justify-content-center align-items-center gap-2">
        {{ recipe.title }}
      </h5>

      <!-- <p class="card-text">{{ recipe.readyInMinutes }} minutes</p> -->
      <p class="card-text">
        {{ recipe.readyInMinutes || 'N/A' }} minutes
      </p>

      <div class="diet-labels d-flex justify-content-center gap-3 mt-1">
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

      <div v-if="recipe.family_owner" class="card-text mt-1">
        <p class="mb-1">Family Recipe for {{ recipe.family_event }}</p>
        <p class="mb-0">by {{ recipe.family_owner }}</p>
      </div>


      <button @click.stop="likeRecipe" class="like-btn mt-1">
        👍 {{ likes }}
      </button>
      <!-- Only for family recipes -->
      <div v-if="recipe.family_owner" class="family-extra mt-2 text-start px-2">
        <h6>Ingredients:</h6>
        <ul class="small">
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>

        <h6>Instructions:</h6>
        <div class="small">
          <div v-for="(step, index) in formattedInstructions" :key="index">
            {{ step }}
          </div>
        </div>
      </div>

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
  computed: {
    formattedInstructions() {
      if (!this.recipe?.instructions || !this.recipe.family_owner) return [];

      const rawText = Array.isArray(this.recipe.instructions)
        ? this.recipe.instructions.join(' ')
        : this.recipe.instructions;

      const normalized = rawText
        .replace(/\r\n|\r/g, '\n')                         // Normalize CRLF
        .replace(/([.?!])(?=\S)/g, "$1 ")                  // Add space if missing after punctuation
        .replace(/([.?!])\s*\n*/g, "$1\n");                // Replace punctuation + whitespace/newlines with single newline

      return normalized
        .split('\n')                                       // Split into lines
        .map(line => line.replace(/<\/?[^>]+(>|$)/g, ''))  // Remove HTML tags
        .map(line => line.replace(/^\s*\d+[).]?\s*/, ''))  // Remove leading numbering
        .map(line => line.trim())                          // Trim whitespace
        .filter(line => line.length > 1);                  // Skip empty or short
    }


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

.card {
  max-width: 400px; 
  max-height: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;

}
/* .card.family-preview {
  width: 100%;
  max-width: none;
  padding: 20px;
  max-height: none;
  min-height: 800px;
  border: none !important;
  background-color: transparent !important;
  outline: none !important;
  box-shadow: none !important;
} */
.card.family-preview {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
  height: 100%;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  outline: none !important;
}

.card.family-preview:hover {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.card.family-preview .image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.card.family-preview .recipe-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0; 
  left: 0;
  z-index: 1;
  border-radius: 12px;
  border: none !important;

}
.card.family-preview .text-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0));
  padding: 16px 10px 10px;
  backdrop-filter: blur(4px);
  text-align: center;
  border: none;
  z-index: 2;
}



.image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;}


.card-body {
  padding: 4px 8px !important;
  margin: 0 !important;
}
.card-text {
  margin-bottom: 2px !important;
  line-height: 1.1;
}
.card-title {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: bold;
  white-space: normal;  
  text-align: center;
  margin-bottom: 0.25rem;
  
}


.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease, opacity 0.3s ease;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; 
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.4s ease;
  pointer-events: none;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}


.image-wrapper:hover .image-overlay {
  opacity: 1;
}
.card:hover .image-overlay {
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
.favorite-icon-simple {
  position: absolute;
  top: 8px;
  left: 10px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: gray;
  cursor: pointer;
  z-index: 2;
  padding: 0;
}
.favorite-icon-simple:hover {
  opacity: 0.8;
}

.favorite-icon-simple.filled {
  color: red;
}

.text-decoration-none {
  text-decoration: none;
}
.text-dark {
  color: inherit;
}
.diet-labels {
  flex-wrap: nowrap;
  flex-shrink: 1;
  justify-content: center;
  gap: 4px;
  overflow-x: auto;
}


.badge-label {
  padding: 2px 6px;
  font-size: 0.75rem;
  border-radius: 10px;
}


.badge-label small {
  margin-left: 5px;
}

.badge-label.active {
  background-color: #d9fdd3;
  color: #1b5e20;
  font-weight: 600;
}


.badge-label.inactive {
  background-color: #eee;
  color: #777;
  font-weight: 400;
}
.like-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 8px;
  color: black;
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
  height: 240px;
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
.text-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px 6px;
  text-align: center;
  backdrop-filter: blur(3px);
  border-top: 1px solid rgba(255,255,255,0.5);
}

.recipePreview.preview-home .card-title {
  font-size: clamp(1.4rem, 1vw, 2rem);
}

.recipePreview.preview-home .card-text {
  font-size: clamp(1.1rem, 2.2vw, 1rem);
}

.recipePreview.preview-home .badge-label {
  font-size: clamp(0.9rem, 1vw, 1rem);
  padding: 6px 10px;
}

.recipePreview.preview-home .badge-label small {
  font-size: clamp(0.8rem, 1.3vw, 1rem);
}
.family-extra .small > div {
  margin-bottom: 6px;
  font-size: 0.85rem;
}
</style>
