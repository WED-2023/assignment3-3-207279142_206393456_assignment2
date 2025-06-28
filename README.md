# Grandma Recipes

Submitters:

- Name: Ron Shukrun | ID: 207279142

- Name: Maor Nezer  | ID: 206393456

---

This repository contains the frontend for the "Grandma Recipes" application.

The application allows users to browse, search, and manage recipes. Authenticated users can save their own personal and family recipes, track viewing history, and mark recipes as favorites.

🌐 The frontend is deployed at: [https://GrandmaRecipes.cs.bgu.ac.il](https://GrandmaRecipes.cs.bgu.ac.il)

📂 Related Projects:

- Backend Repository: [https://github.com/WED-2023/assignment3-2-207279142_206393456_.git](https://github.com/WED-2023/assignment3-2-207279142_206393456_.git)
- API Documentation (Swagger): [https://app.swaggerhub.com/apis/bengurionuniversity-7f9/GrandmaRecipes/1.0.0](https://app.swaggerhub.com/apis/bengurionuniversity-7f9/GrandmaRecipes/1.0.0)

- Changes Made to the API (compared to Assignment 3.1 and Assignment 3.2): A full list of changes appears in final_api_summary.txt

---

## Technologies Used

- Vue.js 3 
- Vue Router
- Axios
- Bootstrap 5
- SCSS 
- Vuelidate 

---
## Application Pages

### 🔹 Home Page

- Guests can view 3 random recipes and use the login form.
- Logged-in users see 3 random recipes and the 3 most recently viewed recipes.
- Recipes that were previously viewed are marked with an "eye" icon.

### 🔹 Search Page

- Users can search for recipes using keywords.
- Advanced filters include:
  - Cuisine
  - Diet (e.g., vegan, vegetarian)
  - Intolerances (e.g., gluten)
  - Number of results
- Sorting options: preparation time or popularity.
- Each recipe shows whether it was viewed or favorited.

### 🔹 Registration Page

- New users can register by filling a validated form.
- The form includes: username, first and last name, country, email, password, and confirm password.

### 🔹 Login Page

- Existing users can log in to the system.
- After login, user information is saved in localStorage and used for authenticated requests.

### 🔹 Recipe Details Page

- Displays complete information about a recipe:
  - Title, image, preparation time, ingredients, instructions.
  - Dietary info: vegan, vegetarian, gluten-free.
- If it’s a family recipe, displays the contributor and the occasion.
- Users can like the recipe and mark it as a favorite.
- Viewing this page adds the recipe to the user’s viewing history.

### 🔹 My Recipes Page

- Shows all personal recipes created by the user.
- Allows viewing of dietary info and whether a recipe was previously viewed.

### 🔹 My Family Recipes Page

- Displays all family recipes added by the user.
- Also shows the family member's name and the event the recipe is related to.

### 🔹 Favorites Page

- Lists all recipes the user marked as favorite.
- Allows quick access to favorite content from anywhere in the app.

### 🔹 About Page

- Provides background information about the system, its intended purpose, previous projects that were the basis for this project, and previous projects in the course.

---

## Project Setup

To get started with the project, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/WED-2023/assignment3-3-207279142_206393456_assignment2.git
cd assignment3-3-207279142_206393456_assignment2

# 2. Install dependencies
npm install

# 3. Build for production
npm run build

# 4. Run the development server
npm run serve


