import axios from 'axios'

export const smartHandServer = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your server's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});
