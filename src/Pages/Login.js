import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import discountLogo from "../Images/discount logo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Prepare login data based on method
  const prepareLoginData = () => {
    if (loginMethod === "email") {
      return {
        email: formData.email,
        password: formData.password
      };
    } else {
      return {
        phone: formData.phone,
        password: formData.password
      };
    }
  };

  // Validate form
  const validateForm = () => {
    if (loginMethod === "email") {
      if (!formData.email || !formData.password) {
        return "Email and Password are required.";
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        return "Please enter a valid email address.";
      }
    } else {
      if (!formData.phone || !formData.password) {
        return "Phone number and Password are required.";
      }
      if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        return "Please enter a valid 10-digit phone number.";
      }
    }
    return "";
  };

  // LOGIN API CALL
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    setIsLoading(true);

    try {
      const loginData = prepareLoginData();
      
      const response = await fetch(
        "https://api.redemly.com/api/vendor/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        if (data.vendor && data.vendor._id) {
          localStorage.setItem("vendorId", data.vendor._id);
          localStorage.setItem("vendorName", data.vendor.name);
          localStorage.setItem("vendorEmail", data.vendor.email);
          localStorage.setItem("vendorLogo", data.vendor.businessLogo);
          localStorage.setItem("vendorToken", data.token);
        }

        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError("Something went wrong. Try again later.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch login method
  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "email" ? "phone" : "email");
    setError("");
    // Clear the opposite field when switching
    if (loginMethod === "email") {
      setFormData({ ...formData, email: "" });
    } else {
      setFormData({ ...formData, phone: "" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-yellow-300 via-yellow-200 to-blue-300">

      <div className="flex flex-col md:flex-row items-center bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full border border-white/40">

        {/* -------- LEFT - LOGIN FORM -------- */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center mb-4 
                         bg-gradient-to-r from-blue-700 to-yellow-600 
                         bg-clip-text text-transparent">
            Redemly
          </h1>

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Vendor Login
          </h2>

          {/* Login Method Toggle */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-4">
              <span className={`font-medium ${loginMethod === 'email' ? 'text-blue-600' : 'text-gray-500'}`}>
                Email
              </span>
              <button
                type="button"
                onClick={toggleLoginMethod}
                className="relative w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors"
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  loginMethod === 'phone' ? 'translate-x-7' : ''
                }`} />
              </button>
              <span className={`font-medium ${loginMethod === 'phone' ? 'text-blue-600' : 'text-gray-500'}`}>
                Phone
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mb-4">
            Login with {loginMethod === "email" ? "Email" : "Phone"}
          </p>

          {error && (
            <div className="p-3 text-red-600 bg-red-100 rounded-xl shadow-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email or Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                type={loginMethod === "email" ? "email" : "tel"}
                name={loginMethod === "email" ? "email" : "phone"}
                value={loginMethod === "email" ? formData.email : formData.phone}
                onChange={handleChange}
                required
                className="block w-full p-3 mt-1 border border-blue-300 rounded-xl 
                           bg-white/70 backdrop-blur 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                           transition-all"
                placeholder={loginMethod === "email" ? "Enter email" : "Enter phone number"}
                pattern={loginMethod === "phone" ? "[0-9]*" : undefined}
                inputMode={loginMethod === "phone" ? "numeric" : undefined}
              />
              {loginMethod === "phone" && (
                <p className="text-xs text-gray-500 mt-1">Enter 10-digit phone number</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full p-3 mt-1 border border-blue-300 rounded-xl 
                           bg-white/70 backdrop-blur 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                           transition-all"
                placeholder="Enter password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full p-3 text-white font-bold rounded-xl shadow-lg 
                         bg-gradient-to-r from-blue-600 to-yellow-500 
                         hover:opacity-90 active:scale-95 transition-all duration-200 
                         ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Signup Section */}
            <div className="pt-4 border-t border-gray-300">
              <p className="text-center text-gray-600 mb-3">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full p-3 text-blue-600 border border-blue-500 rounded-xl 
                           font-semibold bg-white/70 backdrop-blur
                           hover:bg-blue-50 active:scale-95 transition-all"
              >
                Create Vendor Account
              </button>
            </div>
          </form>
        </div>

        {/* -------- RIGHT - IMAGE -------- */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-blue-50 to-yellow-50">
          <img
            src={discountLogo}
            alt="Discount Logo"
            className="object-contain w-4/5 h-auto mb-6"
          />
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h3>
            <p className="text-gray-600">
              Login to manage your vendor account and offers
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Link */}
      <p className="text-center text-gray-700 mt-6 text-sm">
        Forgot your password?{" "}
        <button 
          onClick={() => alert("Forgot password feature coming soon!")}
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          Click here
        </button>
      </p>
    </div>
  );
};

export default LoginPage;