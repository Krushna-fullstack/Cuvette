import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to login");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-2 text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-2 text-sm font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300`}
        >
          Login
        </button>

        <p className="text-center text-sm font-light">
          Don't have an account?{" "}
          <Link className="text-blue-500 font-medium" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
