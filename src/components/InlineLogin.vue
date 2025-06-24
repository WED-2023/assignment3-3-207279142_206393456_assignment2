<template>
    <div class="login-box card p-4 shadow-sm">
      <h3 class="text-center mb-4">Sign In</h3>
  
      <div v-if="loginError" class="alert alert-danger">
        {{ loginError }}
      </div>
  
      <form @submit.prevent="login" @input="v$.$touch()">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input v-model="state.username" type="text" class="form-control" />
          <div v-if="v$.username.$dirty && v$.username.$invalid" class="text-danger">
            <div v-if="v$.username.required.$invalid">Username is required.</div>
          </div>
        </div>
  
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="state.password"
            class="form-control"
          />
          <div class="form-check mt-1">
            <input type="checkbox" id="showPassword" class="form-check-input" v-model="showPassword" />
            <label for="showPassword" class="form-check-label">Show password</label>
          </div>
          <div v-if="v$.password.$dirty && v$.password.$invalid" class="text-danger mt-1">
            <div v-if="v$.password.required.$invalid">Password is required.</div>
            <div v-if="v$.password.minLength.$invalid">Min 6 characters required.</div>
          </div>
        </div>
  
        <button type="submit" class="btn btn-primary w-100 mt-2" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
            

      </form>
    </div>
</template>
  
<script>
  import { reactive, ref } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required, minLength } from '@vuelidate/validators';
  
  export default {
    name: "InlineLogin",
    setup() {
      const state = reactive({ username: '', password: '' });
  
      const rules = {
        username: { required },
        password: { required, minLength: minLength(6) }
      };
  
      const v$ = useVuelidate(rules, state);
      const loginError = ref('');
      const isLoading = ref(false);
      const showPassword = ref(false);
  
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
            window.toast("Success", "Logged in successfully", "success");
            window.location.href = '/';
        } catch (err) {
            loginError.value = err.response?.status === 401 ? 'Incorrect username or password.' : 'Login failed.';
          }
        }
        isLoading.value = false;
      };
      const recoverPassword = () => {
        window.toast("Reset Password", "Redirecting to password recovery...", "info");
        };

      const goToRegister = () => {
        window.router.push('/register');
      };
  
      return {
        state, v$, login, loginError,
        isLoading, showPassword,
        recoverPassword, goToRegister
    };
    }
  };
</script>
  
<style scoped>

  .login-box {
    width: 100%;
    min-height: 340px; 
    margin-top: -100px;  
    padding: 20px 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

</style>
  