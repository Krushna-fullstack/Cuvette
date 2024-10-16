import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import JobDetails from "./components/JobDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("api/v1/auth/me");
        const data = await res.json();

        if (data.error) {
          return null;
        }

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      {authUser && <Navbar />}
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/job/:id"
          element={authUser ? <JobDetails /> : <Navigate to="/login" />}
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
