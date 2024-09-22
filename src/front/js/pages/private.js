// src/front/js/pages/private.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = ({ isAuthenticated }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/error"); // Redirect to error if no token
    } else {
      // Verify the token with the backend
      fetch(`${process.env.BACKEND_URL}/api/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token verification failed");
          }
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error) => {
          console.error("Error:", error);
          navigate("/error");
        });
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">You must log in to view this page.</div>
    );
  }

  return user ? (
    <div className="container mt-5">
      <h1>Welcome, {user.username}!</h1>
      <p>You have access to this private content.</p>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
