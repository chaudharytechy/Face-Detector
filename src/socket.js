// // src/socket.js
// import io from 'socket.io-client';

// // Connect to the backend server (localhost for local development)
// const socket = io('http://localhost:5000');  // Make sure the backend is running at this URL

// // Export the socket instance for use in other components
// export default socket;

// // //


// // 

// src/socket.js

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"] // important to avoid falling back to polling
});

export default socket;

