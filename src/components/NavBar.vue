<template>
  <nav class="navbar navbar-expand-lg custom-navbar px-4 py-2">
    <router-link class="navbar-brand fw-bold text-white" :to="{ name: 'main' }">
      <i class="bi bi-egg-fried me-2"></i> Home
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
          <b-button class="btn-add-recipe me-2" @click="showAddModal = true">
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
              <li><router-link class="dropdown-item" :class="{ activeDropdown: $route.name === 'favorites' }" :to="{ name: 'favorites' }">Favorites</router-link></li>
              <li><router-link class="dropdown-item" :class="{ activeDropdown: $route.name === 'myRecipes' }" :to="{ name: 'myRecipes' }">My Recipes</router-link></li>
              <li><router-link class="dropdown-item" :class="{ activeDropdown: $route.name === 'myFamily' }" :to="{ name: 'myFamily' }">My Family</router-link></li>
            </ul>
          </div>

          <button class="btn btn-outline-danger btn-sm btn-logout" @click="logout">Logout</button>
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
        localStorage.removeItem("lastSearch"); 
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
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(134, 229, 218, 0.984);
  border-radius: 0 0 12px 12px;
  position: sticky;
  top: 0;
  z-index: 1000;
  min-height: 90px; 
  padding-top: 10px;
  padding-bottom: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;

}


.navbar .nav-link {
  color: #1a3d60 !important;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: 'Pacifico', cursive;

}

.navbar .nav-link:hover {
  font-size: 1.6rem;
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
.navbar-brand {
  color: #1a3d60 !important;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.7rem;
  font-family: 'Pacifico', cursive;
  transition: background-color 0.3s ease;
}
.navbar-brand:hover {
  font-size: 1.8rem;
  
}
.dropdown-menu .dropdown-item {
  font-size: 1.05rem;
  font-weight: 500;
  color: #1a3d60 !important;
  font-family: 'Pacifico', cursive;

}
.activeDropdown {
  background-color: #c6f1ff !important;
  border-radius: 8px;
}
.router-link-active.dropdown-item {
  background-color: #c6f1ff;
  border-radius: 8px;
}

.dropdown-item:hover {
  background-color: #e2f7ff;
}

.btn-add-recipe {
  background-color: white;
  font-size: 1.2rem;
  color: #1a3d60;
  font-weight: bold;
  font-family: 'Pacifico', cursive;


}
.btn-add-recipe:hover {
  background-color:  #1a3d60;
  color: #ffffff;
  border: 2px solid ;
  border-radius: 8px;
}


.btn-logout {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Pacifico', cursive;
  border-radius: 8px;
  padding: 6px 12px;
  color: #a01212;
  border: 2px solid #a01212;
  background-color: white;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color:  #a01212;
  color: #ffffff;
  border-color: #a01212;
}
</style>
  