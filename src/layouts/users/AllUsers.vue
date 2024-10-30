<template>
  <div class="p-4 space-y-4">
    <PageHeader title="Table" subtitle="Users">
      <div class="flex flex-col sm:flex-row sm:space-x-2">
        <router-link to="/add-user">
          <BaseButton @click="addNewUser" style="background-color: #2e4053;" class="w-full sm:w-auto">
            Add New User
            <span class="ml-2" aria-hidden="true"><i class="fas fa-plus"></i></span>
          </BaseButton>
        </router-link>

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
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Name</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Role</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Status</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Email</th>
            <th class="px-6 py-3 text-sm text-left text-gray-500 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 dark:bg-dark-header dark:divide-gray-700">
          <tr v-for="(user, index) in filteredData" :key="user.user_id">
            <td class="table-data">{{ index + 1 }}</td>
            <td class="table-data">{{ user.name }}</td>
            <td class="table-data">{{ user.role }}</td>
            <td class="table-data"><BaseButton class="btn btn-block" style="background-color:#1b4f72;color:white">{{ user.status }}</BaseButton></td>
            <td class="table-data">{{ user.email }}</td>
            <td class="table-data">
              <i @click="editUser(user.user_id)" class="fas fa-edit" style="color:#21618c;font-weight:bold;font-size:17px"></i>
              <i @click="deleteUser(user.user_id)" class="fas fa-trash" style="color: #b53b0a;font-weight:bold;font-size:17px"></i>
            </td>
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

const users = ref([]);
const filter = ref('');

// Fetch users when component is mounted
onMounted(async () => {
  await fetchUsers();
});

// Function to fetch users from API
async function fetchUsers() {
  try {
    const response = await axios.get('api/auth/users');
    users.value = response.data.users;
  } catch (error) {
    handleError(error);
  }
}

// Computed property to filter users based on input
const filteredData = computed(() => {
  return users.value.filter(user =>
    user.name.toLowerCase().includes(filter.value.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.value.toLowerCase())
  );
});

// Navigate to edit user page
function editUser(userId) {
  router.push({ name: 'EditUser', params: { user_id: userId } });
}

// Function to delete a user with toast confirmation
async function deleteUser(userId) {
  const deleteToast = toast(
    "Are you sure you want to delete this user?",
    {
      timeout: 0, // Prevent auto-dismiss to allow user interaction
      closeOnClick: false,
      hideProgressBar: true,
      icon: "fas fa-info",
      position: "top-right",
      toastClassName: "custom-toast",
      bodyClassName: "custom-toast-body",
    }
  );

  // Create custom buttons for confirm and cancel
  const confirmButton = document.createElement('button');
  confirmButton.innerText = "Confirm";
  confirmButton.className = "confirm-btn";
  confirmButton.onclick = async () => {
    try {
      await axios.delete(`api/auth/user/${userId}`);
      users.value = users.value.filter(user => user.user_id !== userId);
      toast.success("User deleted successfully.");
    } catch (error) {
      handleError(error);
    }
    toast.dismiss(deleteToast); // Dismiss the toast after action
  };

  const cancelButton = document.createElement('button');
  cancelButton.innerText = "Cancel";
  cancelButton.className = "cancel-btn";
  cancelButton.onclick = () => {
    toast.info("User deletion cancelled.");
    toast.dismiss(deleteToast); // Dismiss the toast
  };

  // Append buttons to the toast
  const toastBody = document.querySelector('.custom-toast-body');
  if (toastBody) {
    toastBody.appendChild(confirmButton);
    toastBody.appendChild(cancelButton);
  }
}

// Handle errors and display as toast messages
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

  toast.error(message);
}

// Export filtered data to Excel
function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(filteredData.value.map(user => ({
    Name: user.name,
    Role: user.role,
    Status: user.status,
    Email: user.email
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  XLSX.writeFile(workbook, 'Users.xlsx');
}

// Export filtered data to PDF
function exportToPDF() {
  const doc = new jsPDF();
  const title = "User Data";
  const headers = [['No', 'Name', 'Role', 'Status', 'Email']];
  const data = filteredData.value.map((user, index) => [
    index + 1,
    user.name,
    user.role,
    user.status,
    user.email
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(12);
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30
  });

  doc.save('Users.pdf');
}
</script>

<style scoped>
.custom-toast-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.confirm-btn, .cancel-btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.confirm-btn {
  background-color: #f44336; /* Red for confirm */
  color: white;
}

.cancel-btn {
  background-color: #2196f3; /* Blue for cancel */
  color: white;
}
</style>