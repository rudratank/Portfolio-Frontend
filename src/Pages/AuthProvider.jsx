import React, { createContext, useContext, useEffect } from "react";
import { userAppStore } from "../store";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { checkAuth, isLoading, userinfo } = userAppStore();

  useEffect(() => {
    const initializeAuth = async () => {
      //console.log("AuthProvider: Initializing auth check...");
      try {
        await checkAuth();
        //console.log("AuthProvider: Auth check completed");
      } catch (error) {
        console.error("AuthProvider: Auth check failed:", error);
      }
    };

    initializeAuth();
  }, [checkAuth]);

  // Add some debugging
  // console.log("AuthProvider - isLoading:", isLoading);
  // console.log("AuthProvider - userinfo:", userinfo);

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
