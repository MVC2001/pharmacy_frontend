<template>
  <div class="py-5 userprofile">
    <div class="container px-4 mx-auto">
      <div class="w-full shadow-lg card">
        <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color:  #154360;">
          <div><i class="mr-2 fa fa-user"></i> User Profile</div>
          <button type="button" class="text-white" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="p-6 bg-white card-body">
          <div class="container mx-auto">
            <!-- Display fetched user information -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="inputName" class="font-semibold form-label">Name</label>
                <input type="text" id="inputName" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.name" readonly />
              </div>
              <div>
                <label for="inputEmail4" class="font-semibold form-label">Email</label>
                <input type="email" id="inputEmail4" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.email" readonly />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="inputRole4" class="font-semibold form-label">Role </label>
                <input type="text" id="inputRole4" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.category" readonly />
              </div>
              <div>
                <label for="inputStatus4" class="font-semibold form-label">Status</label>
                <input type="text" id="inputStatus4" class="w-full px-3 py-2 border rounded form-control"
                  v-model="userData.status" readonly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios'; // Ensure this points to your axios instance
import { useToast } from 'vue-toastification';

const toast = useToast();

// Object to store fetched user data
const userData = ref({
  name: '',
  email: '',
  category: '',
  status: ''
});



// Fetch user profile on component mount
onMounted(async () => {
  try {
    const response = await axios.get('api/auth/profile');
    userData.value = response.data; // Set the fetched data into userData
  } catch (error) {
    handleError(error);
  }
});



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

<style scoped>
.adduserform {
  font-family: 'Euclid Circular', sans-serif;
  font-size: 12px;
}
</style>
