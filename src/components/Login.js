// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // ✅ Redirect and Alert on successful login
  useEffect(() => {
    if (status === 'succeeded' && user) {
      alert(`Welcome, ${user?.name?.firstName || 'User'}!`);
      navigate('/main');
    }
  }, [status, user, navigate]);

  // ✅ Optional: Alert on failed login
  useEffect(() => {
    if (status === 'failed' && error) {
      const errorMsg = typeof error === 'string' ? error : error.message || 'Login failed';
      alert(`❌ ${errorMsg}`);
    }
  }, [status, error]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
      <div className="container p-4 shadow-lg rounded bg-white" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0">Don't have an account?</p>
          <Link to="/" className="btn btn-link text-decoration-none">
            <u>Register Here</u>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
