<template>
    <div class="profile">
      <Menu>
        <MenuButton class="inline-flex items-center justify-center">
          <img class="w-8 h-8 rounded-full" src="/images/male.png" alt="" />
        </MenuButton>
        <MenuItems
          class="absolute right-0 z-20 w-48 mx-2 mt-1 overflow-hidden bg-white divide-y divide-gray-200 rounded-md top-12 dark:bg-dark-header dark:border dark:border-gray-700 dark:divide-gray-600"
        >
        <router-link to="/profile">
          <MenuItem v-slot="{ active }">
            <div
              class="px-4 py-2 text-sm cursor-pointer"
              :class="{
                'bg-gray-100 text-gray-900 dark:bg-dark-body dark:text-gray-400': active,
                'text-gray-700 dark:text-gray-300': !active,
              }"
            >
              User Profile
            </div>
          </MenuItem>
        </router-link>
        
          <MenuItem v-slot="{ active }">
            <div
              @click="logout"
              class="px-4 py-2 text-sm cursor-pointer"
              :class="{
                'bg-gray-100 text-gray-900 dark:bg-dark-body dark:text-gray-400': active,
                'text-gray-700 dark:text-gray-300': !active,
              }"
            >
              Logout
            </div>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  </template>
  
  <script setup>
  import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
  import { useRouter } from "vue-router";
  import axios from "../../axios";
  
  const router = useRouter();
  
  const logout = async () => {
    try {
      // Send logout request to the server
      await axios.post('api/auth/logout', {});
  
      // Remove token from local storage
      localStorage.removeItem('token'); 
  
      // Redirect to the login page
      router.push('/'); 
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };
  </script>
  