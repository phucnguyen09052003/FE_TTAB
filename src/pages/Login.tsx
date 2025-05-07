import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../assets/login.jpg";
import { FaEye, FaEyeSlash, FaSignInAlt, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { AUTH_ENDPOINTS } from "../utils/apiEndpoints";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear notifications after 5 seconds
  useEffect(() => {
    let timer: number;
    if (success || error) {
      timer = window.setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (res.data?.status === 200) {
        const data = res.data.data;
        
        localStorage.setItem("fullname", data.userName);
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("roles", data.roles);
        localStorage.setItem("email", data.email);
        
        setSuccess(res.data.message || "Đăng nhập thành công!");
        
        // Redirect after successful login
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError(res.data?.message || "Đăng nhập không thành công");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 min-h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={loginImg} alt="Login Background" />
      </div>

      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full sm:w-[500px]">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">ĐĂNG NHẬP</h2>
          
          {/* Notifications */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <span className="text-red-100">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span className="text-green-100">{success}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-1 text-sm">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-1 text-sm">Mật khẩu</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-teal-500 py-3 rounded text-white font-semibold hover:bg-teal-600 shadow-lg flex items-center justify-center transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSignInAlt className="mr-2" />
              )}
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-teal-400 hover:text-teal-300 text-sm">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
