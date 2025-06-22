<!-- <template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-4">
        <router-link class="navbar-brand" :to="{ name: 'main' }">Vue Recipes</router-link>
  
        <div class="collapse navbar-collapse show">
            <ul class="navbar-nav me-auto">
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'search' }">Search</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'about' }">About</router-link>
            </li>
            </ul>
  
            <ul class="navbar-nav ms-auto">
            
                <li v-if="!store.username" class="nav-item d-flex align-items-center gap-2">
                    <span class="text-muted">Guest:</span>
                    <router-link class="nav-link" :to="{ name: 'register' }">Register</router-link>
                    <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
                </li>
                <li v-else class="nav-item dropdown">
                    <span class="navbar-text me-2">{{ store.username }}</span>
                    <a
                        class="btn btn-secondary dropdown-toggle btn-sm"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Personal
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="#" @click.prevent="goTo('favorites')">❤️ Favorites</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="goTo('myRecipes')">📄 My Recipes</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="goTo('myFamily')">👨‍👩‍👧‍👦 My Family</a></li>
                        <li><hr class="dropdown-divider" /></li>
                        <li><button class="dropdown-item text-danger" @click="logout">Logout</button></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>
  
  <script>
  import { getCurrentInstance } from 'vue';
  
  export default {
    name: 'NavBar',
    setup() {
      const internalInstance = getCurrentInstance();
      const store = internalInstance.appContext.config.globalProperties.store;
      const toast = internalInstance.appContext.config.globalProperties.toast;
      const router = internalInstance.appContext.config.globalProperties.router;
  
      const logout = () => {
        store.logout();
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      };
  
      const goTo = (routeName) => {
        router.push({ name: routeName });
      };
  
      return { store, logout, goTo };
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  </style>
   -->
<!-- 
   2
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
          <li v-if="!store.username" class="nav-item d-flex align-items-center gap-2">
            <span class="text-light">Guest:</span>
            <router-link class="nav-link text-white" :to="{ name: 'register' }">Register</router-link>
            <router-link class="nav-link text-white" :to="{ name: 'login' }">Login</router-link>
          </li>
  
          <li v-else class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-white d-flex align-items-center gap-2"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle"></i> {{ store.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><router-link class="dropdown-item" :to="{ name: 'favorites' }">❤️ Favorites</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'myRecipes' }">📄 My Recipes</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'myFamily' }">👨‍👩‍👧‍👦 My Family</router-link></li>
              <li><hr class="dropdown-divider" /></li>
              <li><button class="dropdown-item text-danger" @click="logout">Logout</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </template>
   -->


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
        <!-- Guest -->
        <li v-if="!store.username" class="nav-item d-flex align-items-center gap-2">
          <span class="text-light">Guest:</span>
          <router-link class="nav-link text-white" :to="{ name: 'register' }">Register</router-link>
          <router-link class="nav-link text-white" :to="{ name: 'login' }">Login</router-link>
        </li>

        <!-- Logged-in User Dropdown -->
        <li v-else class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle text-white d-flex align-items-center gap-2"
            href="#"
            id="userDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle"></i> {{ store.username }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><router-link class="dropdown-item" :to="{ name: 'favorites' }">❤️ Favorites</router-link></li>
            <li><router-link class="dropdown-item" :to="{ name: 'myRecipes' }">📄 My Recipes</router-link></li>
            <li><router-link class="dropdown-item" :to="{ name: 'myFamily' }">👨‍👩‍👧‍👦 My Family</router-link></li>
            <li><hr class="dropdown-divider" /></li>
            <li><button class="dropdown-item text-danger" @click="logout">Logout</button></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>




<script>
  import { getCurrentInstance } from 'vue';
  
  export default {
    name: 'NavBar',
    setup() {
      const { appContext } = getCurrentInstance();
      const store = appContext.config.globalProperties.store;
      const toast = appContext.config.globalProperties.toast;
      const router = window.router;
  
      const logout = () => {
        store.logout();
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      };
  
      return { store, logout };
    }
  };
</script>
  
<style scoped>
  .custom-navbar {
    background-color: #0d6efd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 12px 12px;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .navbar .nav-link:hover {
    text-decoration: underline;
  }
</style>
  