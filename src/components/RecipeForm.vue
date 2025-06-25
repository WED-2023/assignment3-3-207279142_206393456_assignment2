<template>
    <b-form @submit.prevent="submitForm">
      <!-- Title -->
      <b-form-group label="Title:" label-for="title">
        <b-form-input id="title" v-model="form.title" required />
      </b-form-group>
  
      <!-- Image -->
      <b-form-group label="Image URL:" label-for="image">
        <!-- <b-form-input id="image" v-model="form.image" required type="url" placeholder="https://example.com/image.jpg"/> -->
        <b-form-input id="image" v-model="form.image" required placeholder="e.g. image.png" />

      </b-form-group>
  
      <!-- Time -->
      <b-form-group label="Ready In Minutes:" label-for="minutes">
        <b-form-input
          id="minutes"
          v-model.number="form.readyInMinutes"
          type="number"
          min="1"
          required
        />
      </b-form-group>
  
      <!-- Instructions -->
      <b-form-group label="Instructions:" label-for="instructions">
        <b-form-textarea
          id="instructions"
          v-model="form.instructions"
          rows="4"
          required
        />
      </b-form-group>
  
      <!-- Servings -->
      <b-form-group label="Servings:" label-for="servings">
        <b-form-input
          id="servings"
          v-model.number="form.servings"
          type="number"
          min="1"
          required
        />

      </b-form-group>
  
      <!-- Ingredients -->
    <b-form-group label="Add Ingredient:">
        <b-row class="align-items-end">
            <b-col cols="4">
                <b-form-input v-model="newIngredient.name" placeholder="Name" />
            </b-col>
            <b-col cols="3">
                <b-form-input
                    v-model="newIngredient.quantity"
                    placeholder="Quantity"
                />
            </b-col>
            <b-col cols="3">
                <b-form-input v-model="newIngredient.unit" placeholder="Unit"/>
            </b-col>
            <b-col cols="2">
                <b-button variant="success" @click="addIngredient" :disabled="!newIngredient.name || !newIngredient.quantity">Add</b-button>
            </b-col>
        </b-row>

        <!--List of new Ingredients-->
        <ul class="mt-3 list-group">
            <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(ingredient, index) in form.ingredients"
            :key="index"
            >
            <div>
                {{ ingredient.name }} - {{ ingredient.quantity }} {{ ingredient.unit }}
            </div>
            <b-button size="sm" variant="danger" @click="removeIngredient(index)">
                Remove
            </b-button>
            </li>
        </ul>
    </b-form-group>


      <!-- Tags -->
      <b-form-group label="Tags:">
        <b-form-checkbox v-model="form.vegetarian">Vegetarian</b-form-checkbox>
        <b-form-checkbox v-model="form.vegan">Vegan</b-form-checkbox>
        <b-form-checkbox v-model="form.glutenFree">Gluten Free</b-form-checkbox>
      </b-form-group>
  
      <!-- Family recipe checkbox -->
      <b-form-group label="Is this a family recipe?">
        <b-form-checkbox v-model="form.isFamily" />
      </b-form-group>
  
      <!-- Family info -->
      <div v-if="form.isFamily">
        <b-form-group label="Family Owner:" label-for="owner">
          <b-form-input id="owner" v-model="form.family_owner" />
        </b-form-group>
        <b-form-group label="Event:" label-for="event">
          <b-form-input id="event" v-model="form.event" />
        </b-form-group>
      </div>
  
      <!-- Submit -->
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </template>
  
  <script>
  export default {
    name: "RecipeForm",
    data() {
      return {
        form: {
          title: "",
          image: "",
          readyInMinutes: null,
          instructions: "",
          servings: null,
          ingredients: [],
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          isFamily: false,
          family_owner: "",
          event: "",
        },
        newIngredient: {
            name: "",
            quantity: "",
            unit: ""
        }
      };
    },
    methods: {
        addIngredient() {
            this.form.ingredients.push({ ...this.newIngredient });
            this.newIngredient = { name: "", quantity: "", unit: "" };
        },
        removeIngredient(index) {
            this.form.ingredients.splice(index, 1);
        },
        async submitForm() {
          if (this.form.ingredients.length === 0) {
              this.$root.toast("Missing Ingredients", "Please add at least one ingredient.", "danger");
              return;
          }
          const imageRegex = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;
          if (!this.form.image || !imageRegex.test(this.form.image)) {
            this.$root.toast("Invalid Image", "Please provide an image URL ending with .jpg, .png, etc.", "danger");
            return;
          }

          if (this.form.isFamily) {
            if (!this.form.family_owner || !this.form.event) {
              this.$root.toast("Missing Family Info", "Please fill in both Family Owner and Event fields.", "danger");
              return;
            }
          }
          if (!this.form.servings || this.form.servings < 1) {
            this.$root.toast("Missing Servings", "Please enter the number of servings (minimum 1).", "danger");
            return;
          }

          try {
            await this.$root.axios.post("/users/recipes", this.form);
            this.$root.toast("Success", "Recipe created!", "success");
            this.reset();
            this.$emit("submitted"); // emit success to parent
          } catch (error) {
            console.error("Failed to create recipe", error);
            this.$root.toast("Error", "Failed to create recipe", "danger");
          }
        },
        reset() {
            this.form = {
                title: "",
                image: "",
                readyInMinutes: null,
                instructions: "",
                servings: null,
                ingredients: [],
                vegetarian: false,
                vegan: false,
                glutenFree: false,
                isFamily: false,
                family_owner: "",
                event: "",
            };
            this.newIngredient = {
                name: "",
                quantity: "",
                unit: ""
            };
        }
    },
  };
  </script>
  
<style scoped>
  .mb-2 {
    margin-bottom: 1rem;
  }
  form {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  </style>
  