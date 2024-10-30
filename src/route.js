import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from '@layouts/Auth.vue';
import GuestLayout from '@layouts/Guest.vue';
import ErrorLayout from '@layouts/Error.vue';

import Login from '@components/Pages/Login.vue';
import Register from '@components/Pages/Register.vue';
import Password from '@components/Pages/Password.vue';
import Dashboard from '@components/Pages/Dashboard.vue';
import Table from '@components/Pages/Table.vue';
import Form from '@components/Pages/Form.vue';
import Card from '@components/Pages/Card.vue';
import Error404 from '@components/Pages/Error404.vue';
import ResetPasswordRequest from '@layouts/ResetPasswordRequest.vue'
import ResetPasswordPage from '@layouts/ResetPasswordPage.vue'
import UserProfile from '@layouts/UserProfile.vue'
import AllUsers from '@layouts/users/AllUsers.vue'
import  AddUser from '@layouts/users/AddUser.vue'
import  EditUser from '@layouts/users/EditUser.vue'
import AuditTrail from '@layouts/auditTrail/AuditTrail.vue'

const baseURL = '/';

const routes = [
    {
        path: '/',
        redirect: { name: 'Login' }, // Redirects to Login by default
    },
    {
        path: '/',
        name: 'Auth',
        component: AuthLayout,
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { requiresAuth: true } // This route requires authentication
            },
            {
                path: 'profile',
                name: 'UserProfile',
                component: UserProfile,
                meta: { requiresAuth: true } // This route requires authentication
            },
            {
                path: 'users',
                name: 'AllUsers',
                component: AllUsers,
                meta: { requiresAuth: true } // This route requires authentication
            },
            {
                path: 'add-user',
                name: 'AddUser',
                component:  AddUser,
                meta: { requiresAuth: true } // This route requires authentication
            },
            {
                path: '/edit-user/:user_id',  
                name: 'EditUser',
                component: EditUser,
                props: true,
                meta: { requiresAuth: true }
              },
              {
                path: 'audit-trail',
                name: 'AuditTrail',
                component: AuditTrail,
                props: true,
                meta: { requiresAuth: true }
              },
              
            {
                path: 'table',
                name: 'Table',
                component: Table,
            },
            {
                path: 'form',
                name: 'Form',
                component: Form,
            },
            {
                path: 'card',
                name: 'Card',
                component: Card,
            },
        ]
    },
    {
        path: '/auth',
        component: GuestLayout,
        children: [
            {
                path: '',
                name: 'Login',
                component: Login,
            },
            {
                path: 'register',
                name: 'Register',
                component: Register,
            },
            {
                path: 'password',
                name: 'Password',
                component: Password,
            },
            {
                path: 'reset-password',
                name: 'ResetPasswordRequest',
                component: ResetPasswordRequest,
            },
            {
                path: 'update-password',
                name: 'ResetPasswordPage',
                component: ResetPasswordPage,
            },
            
        ]
    },
    {
        path: '/error',
        name: 'Error',
        component: ErrorLayout,
        children: [
            {
                path: '404',
                name: 'Error404',
                component: Error404,
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' } // Redirects to the 404 error page for any unmatched paths
    }
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(baseURL),
    routes: routes
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // Check if token exists

    if (to.meta.requiresAuth && !token) {
        next({ path: '/auth' }); // Redirect to home path if not authenticated
    } else {
        next(); // Proceed to the route
    }
});

export default router;
