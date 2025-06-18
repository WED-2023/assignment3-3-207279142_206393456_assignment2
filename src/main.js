// import { createApp } from 'vue';
// import App from './App.vue';
// import routes from './router/index';
// import axios from 'axios';
// import VueAxios from 'vue-axios';
// import { createRouter, createWebHistory } from 'vue-router';

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.bundle.js';

// import store from './store';

// const token = localStorage.getItem('token');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// const app = createApp(App);

// app.use(router);
// app.use(VueAxios, axios);

// window.router = router;
// window.axios = axios;

// app.config.globalProperties.store = store;

// app.config.globalProperties.toast = function (title, content, variant = null, append = false) {
//   const toastContainerId = "toast-container";
//   let toastContainer = document.getElementById(toastContainerId);
//   if (!toastContainer) {
//     toastContainer = document.createElement("div");
//     toastContainer.id = toastContainerId;
//     toastContainer.style.position = "fixed";
//     toastContainer.style.top = "1rem";
//     toastContainer.style.right = "1rem";
//     toastContainer.style.zIndex = "1055";
//     document.body.appendChild(toastContainer);
//   }

//   const toast = document.createElement("div");
//   toast.className = `toast align-items-center text-bg-${variant || 'info'} border-0 show`;
//   toast.setAttribute("role", "alert");
//   toast.setAttribute("aria-live", "assertive");
//   toast.setAttribute("aria-atomic", "true");

//   toast.innerHTML = `
//     <div class="d-flex">
//       <div class="toast-body">
//         <strong>${title}</strong><br>${content}
//       </div>
//       <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//     </div>
//   `;

//   if (!append) {
//     toastContainer.innerHTML = "";
//   }
//   toastContainer.appendChild(toast);

//   setTimeout(() => {
//     toast.remove();
//   }, 3000);
// };

// app.mount('#app');




import { createApp } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import store from './store';

// Set Authorization header if token exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

// Setup Vue router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(VueAxios, axios);

// Global store access
app.config.globalProperties.store = store;
window.store = store;

// Global toast function
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

// Expose global objects
window.router = router;
window.axios = axios;
window.toast = app.config.globalProperties.toast;

// Mount app
app.mount('#app');
