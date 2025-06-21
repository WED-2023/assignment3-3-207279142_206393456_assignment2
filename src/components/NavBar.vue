<template>
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
  