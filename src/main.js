// Create Vue app and configure dependencies
import { createApp } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';

// Import Bootstrap and BootstrapVue 3
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BootstrapVue3, VBTooltip } from 'bootstrap-vue-3';

import store from './store';

// Create Vue application instance
const app = createApp(App);

// Register BootstrapVue 3 plugin (must come before directives)
app.use(BootstrapVue3);

// Register tooltip directive from BootstrapVue
app.directive('b-tooltip', VBTooltip);

// Setup Vue router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Configure global Axios settings
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
axios.defaults.baseURL = 'https://GrandmaRecipes.cs.bgu.ac.il';
axios.defaults.withCredentials = true;

// Register plugins
app.use(router);
app.use(VueAxios, axios);

// Global access to store
app.config.globalProperties.store = store;
window.store = store;

// Global toast notification function
app.config.globalProperties.toast = function (title, content, variant = null, append = false) {
  const toastContainerId = "toast-container";
  let toastContainer = document.getElementById(toastContainerId);

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = toastContainerId;
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "1rem";
    toastContainer.style.right = "1rem";
    toastContainer.style.zIndex = "1055";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${variant || 'info'} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}</strong><br>${content}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  if (!append) {
    toastContainer.innerHTML = "";
  }

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Expose important global objects for debugging
window.router = router;
window.axios = axios;
window.toast = app.config.globalProperties.toast;

// Mount the Vue app to the DOM
app.mount('#app');