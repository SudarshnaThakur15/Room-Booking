import React from 'react';
import keys from '../../assets/keys.png';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      navigate('/')
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-black">
      <div className="w-96 bg-pink-200 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={keys} alt="Keys Icon" className="w-20 h-20" />
        </div>
        <h2 className="text-center text-lg font-semibold text-black mb-4">
          Enter your details
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
                   <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="password">
               Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Create Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 focus:outline-none"
              onClick={handleSubmit}
            >
              Login 
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-purple-700 hover:text-purple-800 font-medium underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
