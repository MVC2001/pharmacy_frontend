<template>
  <div class="login">
    <section class="dark:bg-gray-900">
      <div
        class="flex flex-col items-center justify-center px-6 py-1 mx-auto md:h-screen lg:py-0"
        style="background: white; max-width: 100%; width: 380px; padding: 20px;"
      >
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-auto h-16" src="/images/logo.png" alt="" />
        </a>
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700"
          style="box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;"
        >
          <div class="bg-[#1c2833] text-white p-4 rounded-t-lg" style="background-color: #154360;">
            <h1 class="text-xl font-bold text-center">Sign in to your account</h1>
          </div>
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form class="space-y-4 md:space-y-6" @submit.prevent="LoginMethod">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="border text-gray-800 rounded-l focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  v-model="email"
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <div class="relative">
                  <input
                    :type="passwordVisible ? 'text' : 'password'"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="border border-gray-600 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    v-model="password"
                  />
                  <span
                    class="absolute transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                    @click="togglePasswordVisibility"
                  >
                    <i :class="passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <a href="auth/reset-password" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <button
                type="submit"
                class="relative w-full text-white bg-gray-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                :disabled="loading"
                style="background-color: #154360;"
              >
                <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
                  </svg>
                </span>
                <span v-else>Sign in</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
  
  <script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import axios from '../../axios.js'; // Make sure this points to the correct axios instance
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const passwordVisible = ref(false);
const loading = ref(false);
const toast = useToast();
const router = useRouter();

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const LoginMethod = async () => {
  loading.value = true;
  try {
    const response = await axios.post('api/auth/login_v2', {
      email: email.value,
      password: password.value,
    });

    // Retrieve and store token
    const token = response.data.token;
    console.log("Token:", token); // Log token for debugging (optional)
    localStorage.setItem('token', token); // Store token in local storage

    // Optional: Store additional user information if needed
    const user = response.data.user;
     localStorage.setItem('user', JSON.stringify(user)); // Uncomment to store user info

    // Navigate to dashboard
    router.push('/dashboard');
    toast.success("Login successful!");

  } catch (error) {
    if (error.response) {
      // Handle different error responses
      if (error.response.status === 401) {
        console.log("Error: Invalid credentials");
        toast.error("Invalid credentials");
      } else if (error.response.status === 403) {
        console.log("Error: Account is not active");
        toast.error("Account is not active");
      } else {
        const errorMessage = error.response.data.message || "An unknown error occurred";
        console.log("Error:", errorMessage);
        toast.error(errorMessage);
      }
    } else {
      console.log("Error: An unknown error occurred");
      toast.error("An unknown error occurred");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add additional responsive styles here */
@media (max-width: 640px) {
  .login {
    padding: 10px;
  }
  .login section {
    padding: 0;
  }
  .login a {
    font-size: 1.5rem;
  }
}
</style>