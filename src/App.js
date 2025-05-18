// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import Authorize from "./components/Authorize.js";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<Authorize />}>
          <Route path="/main" element={<Main />} />
          {/* More protected routes can be added here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
