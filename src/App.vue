<template>
  <div id="app">
    <NavBar />

    <!-- <div id="nav">
      <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <span v-if="!store.username">
        Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>
      <span v-else>
        {{ store.username }}:
        <router-link :to="{ name: 'myRecipes' }">My Recipes</router-link> |
        <router-link :to="{ name: 'favorites' }">My Favorites</router-link> |
        <router-link :to="{ name: 'myFamily' }">My Family</router-link> |
        <router-link :to="{ name: 'about' }">About</router-link> |

        <button @click="logout" class="btn btn-link p-0">Logout</button> |
      </span>
    </div> -->
    <router-view />
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const viewedRecipeIds = ref([]);
    const lastViewed = ref([]);

    const logout = () => {
      localStorage.removeItem(`lastSearch-${store.username}`)
      store.logout();
      toast("Logout", "User logged out successfully", "success");
      router.push("/").catch(() => {});
    };
    onMounted(async () => {
      if (store.username) {
        try {
          const response = await axios.get("/users/lastWatched");
          lastViewed.value = response.data;
          const allViewed = await axios.get("/users/viewedIds");
          viewedRecipeIds.value = allViewed.data;

          store.viewedRecipeIds = allViewed.data;
        } catch (err) {
          console.error("Failed to fetch viewed recipes", err);
        }
      }
    });
    return {
      store,
      logout,
      lastViewed,
      viewedRecipeIds
    };
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); // ⬅ הוסיפי את זה למעלה
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif,'Pacifico', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a3d60;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #1a3d60;
}

#nav a.router-link-exact-active {
  color: #1a3d60;
}

#app {
  background-color: #ffffff; 
  min-height: 100vh;
  padding-bottom: 20px;
}
</style>