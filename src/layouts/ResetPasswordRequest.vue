<template>
    <div class="container mx-auto mt-5">
        <div class="max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
            <div class="px-4 py-3 bg-gray-100">
                <h2 class="text-lg font-semibold text-center">Request Password Reset</h2>
            </div>
            <div class="px-4 py-6">
                <form @submit.prevent="requestReset">
                    <div class="mb-4">
                        <input
                            type="email"
                            v-model="email"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button type="submit" class="w-full py-2 text-white rounded-md dark:bg-gray-900 hover:bg-blue-900 focus:outline-none" style="background-color: #154360 ">
                        <i class="fa fa-envelope"></i> Send Reset Link
                    </button>
                </form>
                <br>
                <a href="/" class="text-gray-600 hover:underline">
                    <i class="fa fa-home"></i> Home
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '../axios'; 
import { useToast } from 'vue-toastification';

export default {
    data() {
        return {
            email: '',
        };
    },
    methods: {
        async requestReset() {
            const toast = useToast(); // Initialize toast for notifications
            try {
                const response = await axios.post('api/auth/request-reset', { email: this.email });
                // Check for success response
                if (response.status === 200) {
                    toast.success(response.data.message); // Show success message
                }
            } catch (err) {
                // Handle specific error messages
                if (err.response) {
                    // If there is a response from the server
                    if (err.response.status === 404) {
                        toast.error(err.response.data.message); // User not found message
                    } else if (err.response.status === 500) {
                        toast.error('Failed to send reset email. Please try again later.'); // Server error message
                    } else {
                        toast.error('An error occurred. Please try again.'); // General error message
                    }
                } else {
                    // If there is no response from the server (e.g., network error)
                    toast.error('Network error. Please check your connection and try again.'); // Network error message
                }
            }
        },
    },
};
</script>

<style>
/* Add any custom styles here if needed */
</style>
