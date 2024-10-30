<template>
    <div class="p-4 space-y-4">
        <PageHeader title="Audit Trail" subtitle="Logs">
            <div class="flex flex-col sm:flex-row sm:space-x-2">
                <BaseButton @click="exportToExcel" style="background-color:#21618c;" class="w-full sm:w-auto">
                    Export to Excel <span class="ml-2" aria-hidden="true"><i class="fas fa-file-excel"></i></span>
                </BaseButton>

                <BaseButton @click="exportToPDF" style="background-color:#1c2833;" class="w-full sm:w-auto">
                    Export to PDF <span class="ml-2" aria-hidden="true"><i class="fas fa-file-pdf"></i></span>
                </BaseButton>
            </div>
        </PageHeader>

        <div class="flex items-center mb-4">
            <input
                type="text"
                v-model="filter"
                placeholder="Search..."
                class="w-full p-2 border rounded sm:w-auto"
            />
        </div>

        <div class="overflow-x-auto">
            <table class="w-full divide-y divide-gray-200 rounded-table dark:divide-gray-700" id="data-table" style="box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;">
                <thead class="bg-gray-50 dark:bg-neutral-700" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
                    <tr>
                        <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">No</th>
                        <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Action</th>
                        <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Role</th>
                        <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Username</th>
                        <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Logged At</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
                    <tr v-for="(entry, index) in filteredData" :key="entry.id">
                        <td class="table-data">{{ index + 1 }}</td>
                        <td class="table-data">{{ entry.action }}</td>
                        <td class="table-data">{{ entry.category }}</td>
                        <td class="table-data">{{ entry.email }}</td>
                        <td class="table-data">{{ entry.created_at }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios'; // Ensure this points to your axios instance
import { useToast } from 'vue-toastification';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable for table formatting in PDF

const router = useRouter();
const toast = useToast();

const auditTrail = ref([]);
const filter = ref('');

// Fetch audit trail when component is mounted
onMounted(async () => {
    await fetchAuditTrail();
});

// Function to fetch audit trail from API
async function fetchAuditTrail() {
    try {
        const response = await axios.get('api/auth/audit-trail'); // Update the endpoint to match your API
        auditTrail.value = response.data.audit_trail; // Ensure the correct field is accessed
    } catch (error) {
        handleError(error);
    }
}

// Computed property to filter audit trail based on input
const filteredData = computed(() => {
    return auditTrail.value.filter(entry =>
        entry.action.toLowerCase().includes(filter.value.toLowerCase()) ||
        entry.email.toLowerCase().includes(filter.value.toLowerCase()) // Include email filtering
    );
});

// Handle errors and display as toast messages
function handleError(error) {
    let message = 'An unexpected error occurred';

    if (error.response) {
        if (error.response.data && error.response.data.error) {
            message = error.response.data.error; // Update to match the error structure
        } else {
            message = error.response.statusText;
        }
    } else if (error.request) {
        message = 'No response from the server. Please check your connection.';
    } else {
        message = error.message;
    }

    toast.error(message);
}

// Export filtered data to Excel
function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(entry => ({
        Action: entry.action,
        User: entry.email, // Updated to reflect correct property
        Timestamp: entry.created_at, // Updated to reflect correct property
        Details: entry.details // Ensure this field exists in your data
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Trail');
    XLSX.writeFile(workbook, 'AuditTrail.xlsx');
}

// Export filtered data to PDF
function exportToPDF() {
    const doc = new jsPDF();
    const title = "Audit Trail Data";
    const headers = [['No', 'Action', 'User', 'Timestamp', 'Details']];
    const data = filteredData.value.map((entry, index) => [
        index + 1,
        entry.action,
        entry.email, // Updated to reflect correct property
        entry.created_at, // Updated to reflect correct property
        entry.details // Ensure this field exists in your data
    ]);

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(12);
    autoTable(doc, {
        head: headers,
        body: data,
        startY: 30
    });

    doc.save('AuditTrail.pdf');
}
</script>

<style scoped>
/* Add any scoped styles here */
</style>
