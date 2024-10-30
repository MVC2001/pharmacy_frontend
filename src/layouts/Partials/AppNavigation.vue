<template>
    <ul class="text-sm" style="max-height: 550px; overflow-y: auto; background-color: #154360; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
        <li
            class="text-secondary hover:text-dark-secondary hover:bg-dark-primary dark:hover:bg-dark-body"
            v-for="navigation in navigations"
            :key="navigation.name"
            :class="{ 'dark:bg-dark-body': isActive(navigation) }"
        >
            <div class="cursor-pointer" @click="clickNavigation(navigation)">
                <div class="flex items-center py-3 pl-5 pr-2" :class="{ 'justify-between': hasChild(navigation) }">
                    <div>
                        <span>
                            <i class="w-6 mr-3 shrink-0" :class="navigation.icon"></i>
                        </span>
                        <span>{{ navigation.label }}</span>
                    </div>
                    <span v-if="hasChild(navigation)">
                        <i class="w-6 mr-3 shrink-0 fas" :class="navigation.active ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                    </span>
                </div>
            </div>
            <div v-if="hasChild(navigation) && navigation.active">
                <ul>
                    <li
                        class="cursor-pointer text-secondary hover:text-darken-secondary hover:bg-darken-primary dark:hover:bg-black"
                        v-for="child in navigation.children"
                        :key="child.name"
                    >
                        <div class="flex items-center py-2 pl-10 pr-2">
                            <span>
                                <i class="w-4 mr-3 shrink-0" :class="child.icon"></i>
                            </span>
                            <span>{{ child.label }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>


<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigations = [
    {  },
    { icon: 'fas fa-home', label: 'Dashboard', name: 'Dashboard', path: 'Dashboard' },
    { icon: 'fas fa-users', label: 'Users', name: 'Users', path: 'AllUsers' },
    { icon: 'fas fa-lock', label: 'Roles', name: 'Roles', path: 'Roles' },
    { icon: 'fas fa-users', label: 'Permission', name: 'Permission', path: 'Permission' },
    { icon: 'fas fa-history', label: 'AuditTrail', name: 'AuditTrail', path: 'AuditTrail' },
    { icon: 'fas fa-th-list', label: 'Medicine Categories', name: 'MedicineCategories', path: 'MedicineCategories' },
    { icon: 'fas fa-warehouse', label: 'Medicine Inventory', name: 'MedicineInventory', path: 'MedicineInventory' },
    { icon: 'fas fa-pills', label: 'Medicine Stocks', name: 'MedicineStocks', path: 'MedicineStocks' },
    { icon: 'fas fa-cash-register', label: 'Medicine Sales', name: 'MedicineSales', path: 'MedicineSales' },
    { icon: 'fas fa-chart-line', label: 'Inventory Report', name: 'InventoryReport', path: 'InventoryReport' },
    { icon: 'fas fa-chart-line', label: 'Sales Report', name: 'SalesReport', path: 'SalesReport' },
    { icon: 'fas fa-credit-card', label: 'Payments Report', name: 'Payments', path: 'Payments' },
    { icon: 'fas fa-exclamation-triangle', label: 'Error 404', name: 'Error404', path: 'Error404' }
];

const clickNavigation = (navigation) => {
    if (hasChild(navigation)) {
        navigation.active = !navigation.active; // Toggle submenu open/close
        return;
    }
    if (hasPath(navigation)) {
        router.push({ name: navigation.path });
    }
};

const hasPath = (navigation) => navigation.hasOwnProperty('path');
const hasChild = (navigation) => navigation.children && navigation.children.length > 0;
const isActive = (navigation) => navigation.active === true;
</script>

<style scoped>
/* Add a scrollbar style for better visibility */
ul::-webkit-scrollbar {
    width: 8px;
}

ul::-webkit-scrollbar-thumb {
    background: #555; /* Color of the scrollbar */
    border-radius: 10px; /* Rounded corners */
}

ul::-webkit-scrollbar-thumb:hover {
    background: #888; /* Color on hover */
}

.text-secondary {
    color: #B3B3B3;
}
.hover\:text-dark-secondary:hover {
    color: #FFFFFF;
}
.hover\:bg-dark-primary:hover {
    background-color: #3B3B3B;
}
.dark\:hover\:bg-dark-body:hover {
    background-color: #2C2C2C;
}
.hover\:text-darken-secondary:hover {
    color: #E6E6E6;
}
.hover\:bg-darken-primary:hover {
    background-color: #4B4B4B;
}
</style>
