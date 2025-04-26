import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../assets/login.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const data = res.data.data;
      
      localStorage.setItem("fullname", data.userName);
      localStorage.setItem("token", data.accessToken);
     
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi kết nối đến server!");
    }
  };

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 min-h-screen w-full">
      <div className="hidden sm:block">
        <img className="w-full h-full object-cover" src={loginImg} alt="Login Background" />
      </div>

      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full sm:w-[500px]">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">SIGN IN</h2>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="w-full bg-teal-500 py-3 rounded text-white font-semibold hover:bg-teal-600 shadow-lg"
      >
        SIGN IN
      </button>
    </form>
  </div>
</div>


    </div>
  );
}
