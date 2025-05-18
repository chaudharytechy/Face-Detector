// src/pages/Register.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/userSlice'; // Adjust path if needed
import { Link } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: {
      firstName: '',
      lastName: '',
    },
    email: '',
    number: '',
    password: '',
    friendList: ['661a9e1e0b6c7dca1f9c5e12'],
    groupList: ['661aa123f4c9ab15f20a9f88'],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName' || name === 'lastName') {
      setFormData((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error.message || 'Something went wrong';
      alert(errorMessage);
    }
  }, [error]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
      <div className="container p-4 shadow-lg rounded bg-white" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Join Us Today!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.name.firstName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.name.lastName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
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
              type="text"
              name="number"
              placeholder="Phone Number"
              value={formData.number}
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
            Register
          </button>
        </form>

        {/* Status Messages */}
        {status === 'loading' && <p className="text-center text-muted">Registering...</p>}
        {status === 'succeeded' && (
          <p className="text-center text-success">
            Welcome, {user?.name?.firstName || 'User'}! 🎉
          </p>
        )}
        {status === 'failed' && error?.errors && (
          <ul className="list-unstyled text-danger">
            {Object.entries(error.errors).map(([field, msg]) => (
              <li key={field}>
                <strong>{field}:</strong> {msg}
              </li>
            ))}
          </ul>
        )}

        <div className="text-center mt-4">
          <p className="mb-0">Already have an account?</p>
          <Link to="/login" className="btn btn-link text-decoration-none">
            <u>Login Here</u>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
