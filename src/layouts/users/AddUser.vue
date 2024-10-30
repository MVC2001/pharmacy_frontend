<template>
    <div class="py-5 add-user">
      <div class="container px-4 mx-auto">
        <div class="w-full shadow-lg card">
          <div class="flex items-center justify-between px-4 py-2 text-white card-header" style="background-color: #154360;">
            <div><i class="mr-2 fa fa-user-plus"></i> Add New User</div>
            <button type="button" class="text-white" @click="closeModal">
              <i class="fa fa-times"></i>
            </button>
          </div>
  
          <!-- New User Form -->
          <div class="p-6 bg-white card-body">
            <h3 class="mb-4 text-lg font-semibold">Add New User</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label for="newUserName" class="font-semibold form-label">Name</label>
                <input type="text" id="newUserName" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.name" />
              </div>
              <div>
                <label for="newUserEmail" class="font-semibold form-label">Email</label>
                <input type="email" id="newUserEmail" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.email" />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <div>
                <label for="newUserRole" class="font-semibold form-label">Role</label>
                <select id="newUserRole" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.role_id">
                  <option v-for="role in roles" :key="role.role_id" :value="role.role_id">{{ role.category }}</option>
                </select>
              </div>
              <div>
                <label for="newUserStatus" class="font-semibold form-label">Status</label>
                <select id="newUserStatus" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.status">
                  <option value="is_active">Active</option>
                  <option value="not_active">Not Active</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label for="newUserPassword" class="font-semibold form-label">Password</label>
              <input type="password" id="newUserPassword" class="w-full px-3 py-2 border rounded form-control" v-model="newUserData.password" />
            </div>
            <button @click="addUser" class="px-4 py-2 mt-4 text-white rounded hover:bg-blue-700"  style="background-color: #154360;">Add User</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from '@/axios';
  import { useToast } from 'vue-toastification';
  import { useRouter } from 'vue-router';
  
  const toast = useToast();
  const router = useRouter(); // Initialize the router
  const newUserData = ref({ name: '', email: '', role_id: '', status: 'is_active', password: '' });
  const roles = ref([]); // Store roles fetched for dropdown
  
  // Fetch roles on component mount
  onMounted(async () => {
    await fetchRoles();
  });
  
  async function fetchRoles() {
    try {
      const response = await axios.get('api/auth/roles');
      roles.value = response.data;
    } catch (error) {
      handleError(error);
    }
  }
  
  // Add new user function
  async function addUser() {
    try {
      const response = await axios.post('api/auth/add_user', newUserData.value);
      toast.success(response.data.message);
      // Clear the form after a successful registration
      newUserData.value = { name: '', email: '', role_id: '', status: 'is_active', password: '' };
      // Navigate to the users page
      router.push('/users'); // Update this to match your route name for the users page
    } catch (error) {
      handleError(error);
    }
  }
  
  function handleError(error) {
    let message = 'An unexpected error occurred';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else if (error.request) {
      message = 'No response from the server. Please check your connection.';
    } else {
      message = error.message;
    }
    toast.error(message);
  }
  </script>
  
  <style scoped>
  .add-user {
    font-family: 'Euclid Circular', sans-serif;
    font-size: 12px;
  }
  </style>
  