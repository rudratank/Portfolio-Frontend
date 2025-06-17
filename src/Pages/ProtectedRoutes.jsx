import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { userAppStore } from "../store";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userinfo, isLoading } = userAppStore();
  const location = useLocation();

  // console.log("ProtectedRoute - userinfo:", userinfo);
  // console.log("ProtectedRoute - isLoading:", isLoading);
  // console.log("ProtectedRoute - adminOnly:", adminOnly);
  // console.log("ProtectedRoute - location:", location.pathname);

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading authentication...</div>
      </div>
    );
  }

  // For admin routes, check if user exists and is admin
  if (adminOnly) {
    // No user info or user info contains error message - redirect to auth
    if (!userinfo || userinfo.message || !userinfo.id || !userinfo.email) {
      //console.log("No valid userinfo, redirecting to auth");
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Check if user is admin by email
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    // console.log("Admin email from env:", adminEmail);
    // console.log("User email:", userinfo.email);

    if (userinfo.email !== adminEmail) {
      //console.log("Not admin user, redirecting to unauthorized");
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  //aconsole.log("Access granted, rendering children");
  return children;
};
