<template>
  <nav class="navbar navbar-expand-lg custom-navbar px-4 py-2">
    <router-link class="navbar-brand fw-bold text-white" :to="{ name: 'main' }">
      <i class="bi bi-egg-fried me-2"></i> Vue Recipes
    </router-link>

    <button
      class="navbar-toggler text-white"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarContent"
      aria-controls="navbarContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Center image -->
    <div class="navbar-center-image mx-auto d-none d-lg-block">
      <img src="/assets/grandma-logo.png" alt="Grandma Recipes" class="navbar-grandma-img">
    </div>

    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link text-white" :to="{ name: 'search' }">Search</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" :to="{ name: 'about' }">About</router-link>
        </li>
      </ul>

      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <!-- Add Recipe Button -->
        <li v-if="store.username" class="nav-item d-flex align-items-center me-2">
          <b-button variant="outline-light" size="sm" class="me-2" @click="showAddModal = true">
            <i class="bi bi-plus-circle me-1"></i> Add Recipe
          </b-button>

        </li>
        <!-- User Dropdown + Logout -->
        <li v-if="store.username" class="nav-item dropdown d-flex align-items-center gap-3">
          <div>
            <a
              class="nav-link dropdown-toggle text-dark d-flex align-items-center gap-2"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle"></i> Hello, {{ store.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><router-link class="dropdown-item" :to="{ name: 'favorites' }">Favorites</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'myFamily' }">My Family</router-link></li>
            </ul>
          </div>

          <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
        </li>
        <!-- Guest -->
        <li v-else class="nav-item d-flex align-items-center gap-2">
          <span class="text-light">Guest:</span>
          <router-link class="nav-link text-white" :to="{ name: 'register' }">Register</router-link>
          <router-link class="nav-link text-white" :to="{ name: 'login' }">Login</router-link>
        </li>

      </ul>
    </div>
  </nav>
  <RecipeModal
    v-model="showAddModal"
    @recipe-created="handleGlobalRecipeCreated"
  />

</template>




<script>
  import { ref, getCurrentInstance } from 'vue';
  import RecipeModal from '@/components/RecipeModal.vue';

  export default {
    name: 'NavBar',
    components: {
      RecipeModal
    },

    setup() {
      const { appContext } = getCurrentInstance();
      const store = appContext.config.globalProperties.store;
      const toast = appContext.config.globalProperties.toast;
      const router = window.router;
      const showAddModal = ref(false);

      const handleGlobalRecipeCreated = () => {
        showAddModal.value = false;
        toast("Success", "Recipe created!", "success");
      };

      const logout = () => {
        store.logout();
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      };
  
      return { store, logout, showAddModal, handleGlobalRecipeCreated };
    }
  };
</script>
  
<style scoped>

.custom-navbar {
  background-color: #6eaaee;
  box-shadow: 0 2px 10px rgba(41, 112, 245, 0.984);
  border-radius: 0 0 12px 12px;
  position: sticky;
  top: 0;
  z-index: 1000;
  min-height: 90px; 
  padding-top: 10px;
  padding-bottom: 10px;
}


.navbar .nav-link {
  color: #eff6f2 !important;
}

.navbar .nav-link:hover {
  color: #010808 !important;
}
.navbar .btn {
  font-weight: bold;
}
.navbar-center-image {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
  height: 60px;
}

.navbar-grandma-img {
  height: 100px;
  object-fit: contain;
}


</style>
  