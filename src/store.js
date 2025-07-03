// export default store;
import { reactive } from 'vue';

const store = reactive({
  // Get username from localStorage if exists
  username: localStorage.getItem('username'),
  viewedRecipeIds: [],

  // Base server domain used across the app
  server_domain: "https://GrandmaRecipes.cs.bgu.ac.il/api",
    //server_domain: "http://localhost:3000",


  // Save username to localStorage and update store
  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);
  },

  // Clear all user data and navigate to login
  logout() {
    console.log("logout");

    // Remove user info and token from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    // Remove auth header from axios
    delete window.axios.defaults.headers.common['Authorization'];

    // Reset store state
    this.username = undefined;
    this.viewedRecipeIds = [];

    // Redirect to login page
    window.router.push('/login');
  }
});

export default store;
