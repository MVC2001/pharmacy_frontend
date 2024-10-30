


import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue';
import router from "./route.js";
import store from "./store.js";
import './app.css';

// Import Toast and POSITION from vue-toastification
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css'; // Import the Toast CSS

const app = createApp(App);

// Use router and store
app.use(router);
app.use(store);

// Use Toastification with custom options
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
});

// Import your components
import components from '@components/index.js';
components(app);

// Mount the app
app.mount('#app');
