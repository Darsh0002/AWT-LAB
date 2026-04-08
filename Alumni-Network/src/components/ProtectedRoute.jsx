import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component that redirects to login if the user is not authenticated.
 * It checks for the presence of a 'token' in localStorage.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("alumnet-user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user && user.role !== allowedRole) {
    // If user role doesn't match the required role, redirect to their home
    return (
      <Navigate
        to={user.role === "admin" ? "/admin-dashboard" : "/student-dashboard"}
        replace
      />
    );
  }

  // If token is present and role matches, render the protected content
  return children;
};

export default ProtectedRoute;
