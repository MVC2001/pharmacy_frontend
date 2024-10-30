<template>
  <div class="p-4 dashboard">
    <div class="flex flex-wrap -mx-4">
      <!-- First Row: Four Cards -->
      <div 
        v-for="(card, index) in cards" 
        :key="card.id" 
        class="w-full px-4 mb-6 md:w-1/4"
      >
        <div class="p-6 bg-white rounded-lg shadow-md card" style="height: 200px;">
          <!-- Card Header -->
          <div class="card-header">
            <h5 class="text-xl font-semibold">{{ card.title }}</h5>
          </div>
          <!-- Card Body -->
          <div class="card-body">
            <p>{{ card.content }}</p>
          </div>
        </div>
      </div>

      <!-- Second Row: Two Graph Cards -->
      <div class="w-full px-4 mb-6 md:w-1/2"> <!-- Two cards in a row on medium and larger screens -->
        <div class="p-6 bg-white rounded-lg shadow-md card graph-card">
          <div class="flex items-center mb-4">
            <i class="mr-2 text-2xl fas fa-chart-line"></i> <!-- Font Awesome icon -->
            <h5 class="text-xl font-semibold">Sales Report</h5>
          </div>
          <canvas id="salesChart"></canvas> <!-- Canvas for sales chart -->
        </div>
      </div>
      <div class="w-full px-4 mb-6 md:w-1/2"> <!-- Two cards in a row on medium and larger screens -->
        <div class="p-6 bg-white rounded-lg shadow-md card graph-card">
          <div class="flex items-center mb-4">
            <i class="mr-2 text-2xl fas fa-dollar-sign"></i> <!-- Font Awesome icon -->
            <h5 class="text-xl font-semibold">Revenue Generation</h5>
          </div>
          <canvas id="revenueChart"></canvas> <!-- Canvas for revenue chart -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const cards = reactive([
  { id: 1, title: "Users", content: "Manage and view all users." },
  { id: 2, title: "Roles", content: "Assign roles to users." },
  { id: 3, title: "Permissions", content: "Control access levels." },
  { id: 4, title: "Audit Trail", content: "Track changes and activities." }
]);

onMounted(() => {
  // Sales Chart
  const salesCtx = document.getElementById('salesChart').getContext('2d');
  new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [{
        label: 'Sales',
        data: [100, 200, 150, 250, 300],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Sales Report'
        }
      }
    }
  });

  // Revenue Chart
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  new Chart(revenueCtx, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [{
        label: 'Revenue',
        data: [1000, 1200, 800, 1500, 1800],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Revenue Generation'
        }
      }
    }
  });
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.card {
  height: 300px; /* Increased height for graph cards */
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  display: flex;
  flex-direction: column;
}

.card-header {
  background-color:  #154360;
  color: white;
  padding: 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.card-body {
  background-color: white;
  color: #1c2833;
  padding: 10px;
  flex-grow: 1;
}

.graph-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
