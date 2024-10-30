<template>
  <div class="userprofile">
    <div class="container mx-auto">
      <div class="w-full border rounded-lg shadow-lg card">
        <div class="flex items-center justify-between p-4 text-white card-header" style="background-color: #154360 ">
          <i class="fa fa-unlock"></i> Reset Password
          <button type="button" class="close" aria-label="Close"></button>
        </div>
        <div class="p-6 card-body">
          <div class="container">
            <!-- Form for resetting password -->
            <form class="py-5" @submit.prevent="submitForm">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label for="inputEmailReset" class="block text-gray-700 form-label">Enter Email</label>
                  <input type="email" class="block w-full p-2 mt-1 border rounded-md form-control" id="inputEmailReset" v-model="resetEmail" required>
                </div>
                <div>
                  <label for="inputNewPassword" class="block text-gray-700 form-label">New Password</label>
                  <input type="password" class="block w-full p-2 mt-1 border rounded-md form-control" id="inputNewPassword" v-model="newPassword" required>
                </div>
                <div>
                  <label for="inputNewPasswordConfirmation" class="block text-gray-700 form-label">Confirm Password</label>
                  <input type="password" class="block w-full p-2 mt-1 border rounded-md form-control" id="inputNewPasswordConfirmation" v-model="newPasswordConfirmation" required>
                </div>
              </div>
              <div class="flex justify-between py-3">
                <button type="submit" class="px-4 py-2 text-white rounded btn hover:bg-teal-500" style="background-color: #154360 ">
                  <i class="fa fa-unlock"></i> Reset Password
                </button>
                <a href="/" class="px-4 py-2 text-white bg-red-400 rounded btn hover:bg-red-400">
                  <i class="fa fa-home"></i> Back Home
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../axios'; 
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();

// Input fields for resetting password
const resetEmail = ref('');
const newPassword = ref('');
const newPasswordConfirmation = ref('');

// Get the token from the route query
const token = route.query.token;

// Submit form for resetting password
async function submitForm() {
  if (newPassword.value.length < 8) {
    toast.error('Password must be at least 8 characters long.');
    return;
  }

  if (newPassword.value !== newPasswordConfirmation.value) {
    toast.error('Passwords do not match.');
    return;
  }

  try {
    await axios.post('api/auth/password-reset', {
      email: resetEmail.value,
      password: newPassword.value,
      token: token // Include the token in the request
    });

    toast.success('Password reset successfully!');
    // Clear input fields
    resetEmail.value = ''; 
    newPassword.value = ''; 
    newPasswordConfirmation.value = ''; 
  } catch (error) {
    handleError(error);
  }
}

// Handle errors and display appropriate messages
function handleError(error) {
  let message = 'An unexpected error occurred';

  if (error.response) {
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.response.statusText;
    }
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }

  toast.error(message); // Show error message with toast
}
</script>
