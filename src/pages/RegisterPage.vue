<!-- <template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register" @input="v$.$touch()">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          <div v-if="v$.username.required.$invalid">Username is required.</div>
          <div v-if="v$.username.minLength.$invalid">Username must be at least 3 characters.</div>
          <div v-if="v$.username.maxLength.$invalid">Username must be at most 8 characters.</div>
          <div v-if="v$.username.pattern.$invalid">Username must contain letters only (no digits or symbols).</div>
        </div>
      </div>

      <div class="form-group">
        <label>First Name:</label>
        <input v-model="state.first_name" type="text" class="form-control" />
        <div v-if="v$.first_name?.$error" class="text-danger">
          First name is required.
        </div>
      </div>

      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="state.last_name" type="text" class="form-control" />
        <div v-if="v$.last_name?.$error" class="text-danger">
          Last name is required.
        </div>
      </div>

      <div class="form-group">
        <label>Country:</label>
        <select v-model="state.country" class="form-control">
          <option disabled value="">Please select a country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <div v-if="v$.country?.$error" class="text-danger">
          Country is required.
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="state.password"
            class="form-control"
          />
          <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
            {{ showPassword ? 'x' : 'v' }}
          </button>
        </div>
        <div v-if="v$.password.$error" class="text-danger">
          <div v-if="!v$.password.required">Password is required.</div>
          <div v-if="!v$.password.minLength">Password must be at least 5 characters.</div>
          <div v-if="!v$.password.maxLength">Password must be at most 10 characters.</div>
          <div v-if="!v$.password.pattern">Password must include at least one number and one special character.</div>
        </div>

      </div>
      <div class="form-group">
        <label>Confirm Password:</label>
        <div class="input-group">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="state.confirmPassword"
            class="form-control"
          />
          <button type="button" class="btn btn-outline-secondary" @click="showConfirmPassword = !showConfirmPassword">
            {{ showConfirmPassword ? 'x' : 'v' }}
          </button>
        </div>
        <div v-if="v$.confirmPassword.$error" class="text-danger">
          <div v-if="v$.confirmPassword.required.$invalid">Please confirm your password.</div>
          <div v-if="v$.confirmPassword.sameAsPassword.$invalid">Passwords do not match.</div>
        </div>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input v-model="state.email" type="email" class="form-control" />
        <div v-if="v$.email.$error" class="text-danger">
          <div v-if="!v$.email.required">Email is required.</div>
          <div v-if="!v$.email.email">Please enter a valid email address.</div>
        </div>
      </div>

      <button type="submit" class="btn btn-success mt-3">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, sameAs, email, helpers } from '@vuelidate/validators';

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      first_name: '',
      last_name: '',
      country: '',
      password: '',
      confirmPassword: '',
      email: ''
    });


  const rules = {
      username: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(8),
      pattern: helpers.regex(/^[A-Za-z]+$/)
    },
    first_name: { required },
    last_name: { required },
    country: { required },
    password: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(10),
      pattern: helpers.regex(/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/)
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs(() => state.password)
    },
    email: {
      required,
      email
    }
  };



    const v$ = useVuelidate(rules, state);
    const countries = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        countries.value = data.map(c => c.name.common).sort();
      } catch (error) {
        console.error("Failed to load countries", error);
      }
    });
    const register = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/register', {
            username: state.username,
            first_name: state.first_name,
            last_name: state.last_name,
            country: state.country,
            password: state.password,
            confirm_password: state.confirmPassword,
            email: state.email
          });
          window.toast("Registration Successful", "You can now login", "success");
          window.router.push('/login');
        } catch (err) {
          if (err.response?.status === 409) {
            window.toast("Username already exists", "Please choose a different username", "danger");
          } else {
            window.toast("Registration failed", err.response?.data?.message || "Unknown error", "danger");
          }
        }
      }
    };

    expose({ register });
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    return {
      state,
      v$,
      register,
      countries,
      showPassword,
      showConfirmPassword
    };

    // return { state, v$, register, countries };
    //return { state, v$, register };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style> -->
<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register" @input="v$.$touch()">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          <div v-if="v$.username.required.$invalid">Username is required.</div>
          <div v-if="v$.username.minLength.$invalid">Username must be at least 3 characters.</div>
          <div v-if="v$.username.maxLength.$invalid">Username must be at most 8 characters.</div>
          <div v-if="v$.username.pattern.$invalid">Username must contain letters only.</div>
        </div>
      </div>

      <div class="form-group">
        <label>First Name:</label>
        <input v-model="state.firstname" type="text" class="form-control" />
        <div v-if="v$.firstname?.$error" class="text-danger">
          First name is required.
        </div>
      </div>

      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="state.lastname" type="text" class="form-control" />
        <div v-if="v$.lastname?.$error" class="text-danger">
          Last name is required.
        </div>
      </div>

      <div class="form-group">
        <label>Country:</label>
        <select v-model="state.country" class="form-control">
          <option disabled value="">Please select a country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
        <div v-if="v$.country?.$error" class="text-danger">
          Country is required.
        </div>
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$error" class="text-danger">
          <div v-if="v$.password.required.$invalid">Password is required.</div>
          <div v-if="v$.password.minLength.$invalid">At least 5 characters.</div>
          <div v-if="v$.password.maxLength.$invalid">At most 10 characters.</div>
          <div v-if="v$.password.pattern.$invalid">Include number & special character.</div>
        </div>
      </div>

      <div class="form-group">
        <label>Confirm Password:</label>
        <input v-model="state.confirmPassword" type="password" class="form-control" />
        <div v-if="v$.confirmPassword.$error" class="text-danger">
          <div v-if="v$.confirmPassword.required.$invalid">Please confirm your password.</div>
          <div v-if="v$.confirmPassword.sameAsPassword.$invalid">Passwords do not match.</div>
        </div>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input v-model="state.email" type="email" class="form-control" />
        <div v-if="v$.email.$error" class="text-danger">
          <div v-if="v$.email.required.$invalid">Email is required.</div>
          <div v-if="v$.email.email.$invalid">Invalid email.</div>
        </div>
      </div>

      <button type="submit" class="btn btn-success mt-3">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email, sameAs, helpers } from '@vuelidate/validators';

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    // Use reactive instead of ref for consistent access
    const state = reactive({
      username: '',
      firstname: '',
      lastname: '',
      country: '',
      password: '',
      confirmPassword: '',
      email: '',
      profilePic: undefined
    });

    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        pattern: helpers.regex(/^[A-Za-z]+$/)
      },
      firstname: { required },
      lastname: { required },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        pattern: helpers.regex(/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(computed(() => state.password))
      },
      email: {
        required,
        email
      }
    };

    const v$ = useVuelidate(rules, state);
    const countries = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        countries.value = data.map(c => c.name.common).sort();
      } catch (error) {
        console.error("Failed to load countries", error);
      }
    });

    const register = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/Register', {
            username: state.username,
            firstname: state.firstname,
            lastname: state.lastname,
            country: state.country,
            password: state.password,
            email: state.email,
            profilePic: state.profilePic
          });
          window.toast("Registration Successful", "You can now login", "success");
          window.router.push('/login');
        } catch (err) {
          if (err.response?.status === 409) {
            window.toast("Username already exists", "Please choose a different username", "danger");
          } else {
            window.toast("Registration failed", err.response?.data?.message || "Unknown error", "danger");
          }
        }
      }
    };

    expose({ register });

    return {
      state,
      v$,
      register,
      countries
    };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style>
