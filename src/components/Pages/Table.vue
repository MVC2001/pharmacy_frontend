<template>
    <div class="p-4 space-y-4">
        <PageHeader title="Table" subtitle="Users">
            <BaseButton @click="addNewItem" style="background-color: #21618c ;">
                Add New User
                <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
            </BaseButton>
            
            <BaseButton @click="exportToExcel" style="background-color:#2e4053 ;">
                Export to Excel <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel"></i></span>
            </BaseButton>

            <BaseButton @click="exportToPDF" style="background-color:#1c2833;">
                Export to PDF <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
            </BaseButton>
        </PageHeader>

        <div class="flex items-center mb-4">
            <input 
                type="text" 
                v-model="filter" 
                placeholder="Search..." 
                class="p-2 border rounded"
            />
        </div>

        <div class="border-b border-gray-200 dark:border-dark-body">
            <table class="rounded-table w-full divide-y divide-gray-200 dark:divide-gray-700" id="data-table" style="box-shadow: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px;">
                <thead class="bg-gray-800 dark:bg-neutral-700">
                    <tr>
                        <th class="px-6 py-3 text-sm text-gray-500 dark:text-gray-200 text-left">No</th>
                        <th class="px-6 py-3 text-sm text-gray-500 dark:text-gray-200 text-left">Name</th>
                        <th class="px-6 py-3 text-sm text-gray-500 dark:text-gray-200 text-left">Role</th>
                        <th class="px-6 py-3 text-sm text-gray-500 dark:text-gray-200 text-left">Status</th>
                        <th class="px-6 py-3 text-sm text-gray-500 dark:text-gray-200 text-left">Email</th>
                        <th class="px-6 py-3 text-sm text-gray-500 dark:text-gray-200 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-dark-header divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="(item, index) in filteredData" :key="item.email">
                        <td class="table-data">{{ index + 1 }}</td>
                        <td class="table-data">{{ item.name }}</td>
                        <td class="table-data">{{ item.role }}</td>
                        <td class="table-data">{{ item.status }}</td>
                        <td class="table-data">{{ item.email }}</td>
                        <td class="table-data">
                            <BaseButton @click="editItem(item)" style="background-color:#192c3e ;">
                                <i class="fas fa-edit"></i>
                            </BaseButton>
                            <BaseButton @click="deleteItem(item)" style="background-color:#d9534f;">
                                <i class="fas fa-trash"></i>
                            </BaseButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Pagination 
            :current-page="currentPage" 
            :total-items="filteredData.length" 
            :items-per-page="itemsPerPage" 
            @change-page="changePage"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable for tables
import * as XLSX from 'xlsx'; // Import xlsx library

// Define an interface for data structure
interface UserData {
    name: string;
    role: string;
    status: string;
    email: string;
}

// Sample Data
const data: UserData[] = [
    { name: 'John Doe', role: 'Admin', status: 'Active', email: 'john@example.com' },
    { name: 'Jane Smith', role: 'User', status: 'Inactive', email: 'jane@example.com' },
    { name: 'Alice Johnson', role: 'Guest', status: 'Active', email: 'alice@example.com' },
    // Add more data as needed
];

// Pagination and filtering logic
const itemsPerPage = 5; // Set items per page
const currentPage = ref(1);
const filter = ref('');

const filteredData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return data.filter(item => {
        return (
            item.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            item.role.toLowerCase().includes(filter.value.toLowerCase()) ||
            item.email.toLowerCase().includes(filter.value.toLowerCase())
        );
    }).slice(start, end);
});

// Pagination method
const changePage = (page: number) => {
    currentPage.value = page;
};

// Function to edit an item
const editItem = (item: UserData) => {
    console.log('Editing item:', item);
};

// Function to delete an item
const deleteItem = (item: UserData) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        console.log('Deleting item:', item);
    }
};

// Function to export data to PDF
const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["No", "Name", "Role", "Status", "Email"];
    const tableRows = [];

    filteredData.value.forEach((item, index) => {
        const itemData = [
            index + 1,
            item.name,
            item.role,
            item.status,
            item.email,
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.text("User List", 14, 15);
    doc.save("user_list.pdf");
};

// Function to export data to Excel
const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map((item, index) => ({
        No: index + 1,
        Name: item.name,
        Role: item.role,
        Status: item.status,
        Email: item.email,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "user_list.xlsx");
};
</script>


<style scoped>
.table-data {
    padding: 1rem;
}
</style>
