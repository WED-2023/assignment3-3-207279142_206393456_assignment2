<template>
  <div class="login-page">
    <h1>Login</h1>

    <!-- Show login error if exists -->
    <div v-if="loginError" class="alert alert-danger">
      {{ loginError }}
    </div>

    <form @submit.prevent="login" @input="v$.$touch()">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$dirty && v$.username.$invalid" class="text-danger">
          <div v-if="v$.username.required.$invalid">Username is required.</div>
        </div>
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$dirty && v$.password.$invalid" class="text-danger">
          <div v-if="v$.password.required.$invalid">Password is required.</div>
          <div v-if="v$.password.minLength.$invalid">Password must be at least 6 characters.</div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary mt-3" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>

      <div class="mt-3 text-center">
        <p>Don't have an account? 
          <a @click.prevent="goToRegister" href="#">Register here</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

export default {
  name: "LoginPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);
    const loginError = ref('');
    const isLoading = ref(false);

    const login = async () => {
      loginError.value = '';
      isLoading.value = true;

      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/login', {
            username: state.username,
            password: state.password
          });

          // Save username and navigate to main page
          window.store.login(state.username);
          window.router.push('/');
        } catch (err) {
          // Handle known error statuses
          if (err.response?.status === 401 || err.response?.status === 403) {
            loginError.value = 'Incorrect username or password.';
          } else {
            loginError.value = 'Login failed. Please try again.';
          }
        }
      }

      isLoading.value = false;
    };

    const goToRegister = () => {
      window.router.push('/register');
    };

    expose({ login });
    return { state, v$, login, goToRegister, loginError, isLoading };
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: auto;
}
</style>
