<template>
  <div class="card h-100">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div class="card-body text-center">
    <h5 class="card-title">{{ recipe.title }}</h5>
    <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
    <p class="card-text">
      Likes: {{ recipe.aggregateLikes ?? recipe.likes ?? 0 }}
    </p>
    <!-- Family Recipe Info -->
    <p v-if="recipe.family_owner" class="card-text">
      Family Recipe by {{ recipe.family_owner }} ({{ recipe.family_event }})
    </p>

    <!--<pre>{{ recipe }}</pre>--> 

    <!-- Favorite Button -->
    <button @click.stop="toggleFavorite" class="favorite-btn">
      <span :class="{ filled: isFavorite }">❤</span>
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
      isFavorite: false
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

</style>
