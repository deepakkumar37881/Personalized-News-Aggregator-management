import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebook, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in ALL the fields!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;
      const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
      
      if (response.data.message === "Login Successfull") {
        localStorage.setItem("token", response.data.token);
        dispatch(setUser(response.data.user));
        navigate("/home");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      {/* Updated Back Button */}
      <button 
        onClick={() => navigate("/")} 
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-700 bg-white shadow-md hover:shadow-lg  hover:cursor-pointer rounded-lg px-4 py-2 transition-all duration-300 ease-in-out"
      >
        <FaArrowLeft className="mr-2" />
        <span className="font-medium">Back to Home</span>
      </button>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-8">Login to your NewsHub account</p>

        {error && (
          <div className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all duration-300 ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-gray-600 my-6">OR</div>

        <div className="flex justify-center space-x-6">
          <button className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200">
            <FaGoogle size={20} /> <span>Google</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-all duration-200">
            <FaFacebook size={20} /> <span>Facebook</span>
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;