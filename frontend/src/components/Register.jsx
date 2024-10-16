import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    mobile: "",
  });

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const { mutate: register, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Registration successful! Please verify your email."
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "candidate",
        mobile: "",
      });

      navigate("/login"); // Programmatically navigate to the login page
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-2 text-sm font-bold text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-2 text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="mobile"
            className="mb-2 text-sm font-bold text-gray-700"
          >
            Mobile Number
          </label>
          <input
            type="text"
            id="mobile"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="role"
            className="mb-2 text-sm font-bold text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="company">Company</option>
            <option value="candidate">Candidate</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 ${
            isLoading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        <p className="text-center text-sm font-light">
          Already have an account ?{" "}
          <Link className="text-blue-500 font-medium" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
