// src/socket.js
import io from 'socket.io-client';

// Connect to the backend (ensure the URL is correct)
const socket = io('http://localhost:5000');  // Replace with your backend URL if necessary

export default socket;
