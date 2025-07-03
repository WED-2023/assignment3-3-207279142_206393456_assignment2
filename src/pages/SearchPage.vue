<template>
  <div class="search-page">
    <h1 class="list-title">Search Page</h1>

    <!-- Search row (input only) -->
    <div class="mb-3">
      <label for="searchQuery" class="form-label">Search</label>
      <div class="input-group">
        <input
          id="searchQuery"
          v-model="searchQuery"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': searchError }"
          placeholder="e.g., pasta, chicken..."
        />
        <button class="btn btn-outline-secondary" @click="searchRecipes">Search</button>
        <div v-if="searchError" class="invalid-feedback">
          Please enter a search term.
        </div>
      </div>
    </div>

    <!-- Filters row -->
    <div class="d-flex flex-wrap align-items-end gap-3 mb-3">
      <div>
        <label for="resultsLimit" class="form-label">Results</label>
        <select id="resultsLimit" v-model="resultsLimit" class="form-select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>

      <div>
        <label for="cuisine" class="form-label">Cuisine</label>
        <select id="cuisine" v-model="selectedCuisine" class="form-select">
          <option value="">Any</option>
          <option value="african">African</option>
          <option value="chinese">Chinese</option>
          <option value="french">French</option>
          <option value="indian">Indian</option>
          <option value="italian">Italian</option>
          <option value="japanese">Japanese</option>
          <option value="mexican">Mexican</option>
          <option value="middle eastern">Middle Eastern</option>
          <option value="thai">Thai</option>
        </select>
      </div>

      <div>
        <label for="diet" class="form-label">Diet</label>
        <select id="diet" v-model="selectedDiet" class="form-select">
          <option value="">Any</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
          <option value="ketogenic">Ketogenic</option>
          <option value="pescetarian">Pescetarian</option>
        </select>
      </div>

      <div>
        <label for="intolerance" class="form-label">Intolerance</label>
        <select id="intolerance" v-model="selectedIntolerance" class="form-select">
          <option value="">None</option>
          <option value="dairy">Dairy</option>
          <option value="egg">Egg</option>
          <option value="gluten">Gluten</option>
          <option value="peanut">Peanut</option>
          <option value="seafood">Seafood</option>
          <option value="sesame">Sesame</option>
          <option value="soy">Soy</option>
          <option value="sulfite">Sulfite</option>
          <option value="tree nut">Tree Nut</option>
          <option value="wheat">Wheat</option>
        </select>
      </div>
    </div>

    <!-- Sorting shown only after user has searched -->
    <div v-if="hasSearched && searchResults.length" class="mb-3">
      <label for="sortOption" class="form-label">Sort by:</label>
      <select id="sortOption" v-model="sortOption" class="form-select w-auto">
        <option value="">None</option>
        <option value="time">Preparation Time</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>

    <!-- No results message -->
    <div v-if="hasSearched && searchResults.length === 0" class="alert alert-warning">
      No results found. Try a different search.
    </div>

    <!-- Results -->
    <RecipePreviewList
      v-if="searchResults.length"
      title="Search Results"
      :recipes="sortedResults"
      :gridMode="true"

    />
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from "vue";
import RecipePreviewList from "@/components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const searchQuery = ref("");
    const resultsLimit = ref("5");
    const selectedCuisine = ref("");
    const selectedDiet = ref("");
    const selectedIntolerance = ref("");
    const sortOption = ref("");
    const searchResults = ref([]);
    const searchError = ref(false);
    const hasSearched = ref(false);

    if (store.username) {
      const savedSearch = localStorage.getItem("lastSearch");
      if (savedSearch) {
        try {
          const parsed = JSON.parse(savedSearch);
          searchQuery.value = parsed.searchQuery || "";
          resultsLimit.value = parsed.resultsLimit || "5";
          selectedCuisine.value = parsed.selectedCuisine || "";
          selectedDiet.value = parsed.selectedDiet || "";
          selectedIntolerance.value = parsed.selectedIntolerance || "";
          sortOption.value = parsed.sortOption || "";
          searchResults.value = parsed.searchResults || [];
          hasSearched.value = true;
        } catch (err) {
          console.warn("Failed to parse last search from localStorage:", err);
        }
      }
    } else {
      localStorage.removeItem("lastSearch");
    }

    const searchRecipes = async () => {
      if (!searchQuery.value.trim()) {
        searchError.value = true;
        return;
      }
      searchError.value = false;

      try {
        const params = {
          query: searchQuery.value,
          limit: resultsLimit.value
        };
        if (selectedCuisine.value) params.cuisine = selectedCuisine.value;
        if (selectedDiet.value) params.diet = selectedDiet.value;
        if (selectedIntolerance.value) params.intolerances = selectedIntolerance.value;

        const response = await internalInstance.appContext.config.globalProperties.axios.get(
          "/recipes", { params }
        );

        searchResults.value = response.data.map(r => ({
          ...r,
          wasViewed: store.viewedRecipeIds?.includes(r.recipe_id || r.id)
        }));
        hasSearched.value = true;

        if (store.username) {
          localStorage.setItem("lastSearch", JSON.stringify({
            searchQuery: searchQuery.value,
            resultsLimit: resultsLimit.value,
            selectedCuisine: selectedCuisine.value,
            selectedDiet: selectedDiet.value,
            selectedIntolerance: selectedIntolerance.value,
            sortOption: sortOption.value,
            searchResults: response.data
          }));
        }

      } catch (err) {
        console.error("Search failed", err);
        searchResults.value = [];
        hasSearched.value = true;
      }
    };



    const sortedResults = computed(() => {
      if (!sortOption.value || !searchResults.value.length) return searchResults.value;

      return [...searchResults.value].sort((a, b) => {
        if (sortOption.value === "time") {
          return a.readyInMinutes - b.readyInMinutes;
        } else if (sortOption.value === "popularity") {
          return (b.popularity || 0) - (a.popularity || 0);
        }
        return 0;
      });
    });

    return {
      store,
      searchQuery,
      resultsLimit,
      searchResults,
      searchRecipes,
      selectedCuisine,
      selectedDiet,
      selectedIntolerance,
      sortOption,
      sortedResults,
      searchError,
      hasSearched
    };
  }
};
</script>

<style>
.list-title {
  font-size: 2.6rem;
  font-weight: 800;
  text-align: center;
  color: #000;
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
  font-family: 'Pacifico', cursive;


}
.search-page {
  max-width: 800px;
  margin: auto;
  padding: 0 15px;
  font-family: Avenir, Helvetica, Arial, sans-serif;

}

</style>