import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found. Redirecting to login.");
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/protected-route", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          console.log("✅ User is authenticated.");
          setIsAuthenticated(true);
        } else {
          console.warn("❌ Token is invalid.");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Invalid or expired token. Redirecting to login.", error);
        localStorage.removeItem("token"); // Clear invalid token
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>; // Show loading while checking auth
  return isAuthenticated ? element : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
