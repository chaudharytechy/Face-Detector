// components/Authorize.js
import socket from '../socket';
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom'; // <-- Added useLocation hook
import { useDispatch, useSelector } from 'react-redux';
import { authCheck } from '../redux/userSlice';

const Authorize = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // <-- Added location hook to remember the page user wanted to access
  const { user, status } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(authCheck());
    }
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') {
    return <div>🔐 Checking authentication...</div>;
  }

  // ✅ Fixed redirect: Instead of '/' use '/login' for unauthenticated users
  if (status === 'failed' || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />; // <-- This is where the fix is made
  }

  return <Outlet />;
};

export default Authorize;
