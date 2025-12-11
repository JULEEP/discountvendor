import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import discountLogo from '../Images/discount logo.png'; // 👈 Import your local image

const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile) {
      setError('Mobile number is required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://31.97.206.144:6098/api/vendor/vendor-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.vendorId) {
          localStorage.setItem('vendorId', data.vendorId);
          alert(`✅ Vendor ID stored: ${data.vendorId}`);
        } else {
          setError('Vendor ID not found in response.');
          return;
        }

        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-4xl font-bold text-blue-600 text-center mb-4">Redemly</h1>
          <h2 className="text-xl font-bold text-center text-gray-800">Vendor Login</h2>

          {error && (
            <div className="p-3 text-red-600 bg-red-100 rounded-md shadow-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="mobile">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500 focus:border-teal-600 transition duration-200"
                placeholder="Enter your mobile number"
              />
            </div>

            <button
              type="submit"
              className={`w-full p-3 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-200 transform ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* 👇 Updated Image Section with Local Logo */}
        <div className="w-full md:w-1/2 flex justify-center p-4 md:p-0">
          <img
            src={discountLogo}
            alt="Discount Logo"
            className="object-contain w-3/4 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
