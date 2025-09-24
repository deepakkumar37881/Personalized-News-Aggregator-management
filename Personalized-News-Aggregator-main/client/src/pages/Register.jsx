import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BACKEND_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") setFullName(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // Validate the form before submission
  const validateForm = () => {
    if (!fullName || !email || !password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/users/register`, {
        name: fullName,
        email,
        password,
      });

      setLoading(false);
      if (response.data.message === "User registered!") {
        navigate("/login");
      } else {
        setError(response.data.message || "Something went wrong, please try again");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  // Handle social login authentication
  const handleGoogleLogin = async () => {
    try {
      // This is a placeholder. In a real app, you'd implement Google OAuth
      // Typically, this would redirect to a Google authentication endpoint
      alert("Google Login functionality to be implemented");
      // Example of how it might look:
      // window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      setError("Google login failed");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // This is a placeholder. In a real app, you'd implement Facebook OAuth
      // Typically, this would redirect to a Facebook authentication endpoint
      alert("Facebook Login functionality to be implemented");
      // Example of how it might look:
      // window.location.href = `${API_URL}/auth/facebook`;
    } catch (error) {
      setError("Facebook login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6 relative">
      {/* Back Button */}
        <button 
              onClick={() => navigate("/")} 
              className="absolute top-6 left-6 flex items-center space-x-2 text-gray-700 bg-white shadow-md hover:cursor-pointer hover:shadow-lg rounded-lg px-4 py-2 transition-all duration-300 ease-in-out"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">Back to Home</span>
            </button>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">Create an Account</h2>
        <p className="text-center text-gray-600 mb-8">Join NewsHub today!</p>

        {error && (
          <div className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all duration-300 ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center text-gray-600 my-6">OR</div>

        <div className="flex justify-center space-x-6">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            <FaGoogle size={20} /> <span>Google</span>
          </button>
          <button 
            onClick={handleFacebookLogin}
            className="flex items-center space-x-2 bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-all duration-200"
          >
            <FaFacebook size={20} /> <span>Facebook</span>
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;