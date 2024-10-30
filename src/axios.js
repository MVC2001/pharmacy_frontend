import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.100.114:8000/', // Adjust to your backend URL
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Handle any errors that occur
});

// Response interceptor to handle unauthorized access
instance.interceptors.response.use(response => {
  return response; // Return the response if successful
}, error => {
  if (error.response && error.response.status === 401) {
    console.error('Unauthorized, redirecting to login');
    localStorage.removeItem('token'); // Clear token on unauthorized
    window.location.href = '/auth'; // Redirect to login page
  }
  return Promise.reject(error); // Handle any other errors
});

export default instance;
