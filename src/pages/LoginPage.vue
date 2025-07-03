<template>
  <div class="login-page">
    <h1 class="list-title">Login</h1>

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
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="state.password"
          class="form-control"
        />
        <div class="form-check mt-1">
          <input
            type="checkbox"
            id="showPassword"
            class="form-check-input"
            v-model="showPassword"
          />
          <label for="showPassword" class="form-check-label">Show password</label>
        </div>
        <div v-if="v$.password.$dirty && v$.password.$invalid" class="text-danger mt-1">
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
    const showPassword = ref(false); //checkbox binding

    const login = async () => {
      loginError.value = '';
      isLoading.value = true;

      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/login', {
            username: state.username,
            password: state.password
          });

          window.store.login(state.username);
          window.router.push('/');
        } catch (err) {
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
    return { state, v$, login, goToRegister, loginError, isLoading, showPassword };
  }
};
</script>

<style scoped>
  .login-page {
    max-width: 400px;
    margin: auto;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  .list-title {
    font-size: 2.6rem;
    font-weight: 800;
    text-align: center;
    color: #000000;
    margin: 40px 0 30px;
    position: relative;
    letter-spacing: 1px;
    text-transform: none;
    font-family: 'Pacifico', cursive;

  }

  .list-title::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #9ae0f1, #b3efe5);
    margin: 12px auto 0;
    border-radius: 2px;
  }

</style>
