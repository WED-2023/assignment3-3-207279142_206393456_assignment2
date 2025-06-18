import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import MyRecipes from "../pages/MyRecipesPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  },
  {
    path: "/my-recipes",
    name: "myRecipes",
    component: MyRecipes
  },
  {
    path: "/add-recipe",
    name: "addRecipe",
    component: () => import("../pages/AddRecipePage.vue")
  },
  {
    path: "/my-favorites",
    name: "favorites",
    component: () => import("../pages/MyFavoritesPage.vue"),
  }
  
  
];

export default routes;
