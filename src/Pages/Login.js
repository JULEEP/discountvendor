import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import discountLogo from "../Images/discount logo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("email");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const prepareLoginData = () => {
    return loginMethod === "email"
      ? { email: formData.email, password: formData.password }
      : { phone: formData.phone, password: formData.password };
  };

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
      if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        return "Please enter a valid 10-digit phone number.";
      }
    }
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.redemly.com/api/vendor/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prepareLoginData()),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.vendor?._id) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "email" ? "phone" : "email");
    setError("");
    setFormData({ ...formData, email: "", phone: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 
                    bg-gradient-to-br from-blue-600 via-blue-400 to-white">

      <div className="flex flex-col md:flex-row bg-white/80 backdrop-blur-xl 
                      rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">

        {/* LEFT – FORM */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center 
                         bg-gradient-to-r from-blue-700 to-blue-500 
                         bg-clip-text text-transparent">
            Redemly
          </h1>

          <h2 className="text-xl font-semibold text-center text-gray-800">
            Vendor Login
          </h2>

          {/* Toggle */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <span className={loginMethod === "email" ? "text-blue-600 font-medium" : "text-gray-400"}>
                Email
              </span>
              <button
                type="button"
                onClick={toggleLoginMethod}
                className="w-14 h-7 bg-blue-200 rounded-full relative"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform
                    ${loginMethod === "phone" ? "translate-x-7" : ""}`}
                />
              </button>
              <span className={loginMethod === "phone" ? "text-blue-600 font-medium" : "text-gray-400"}>
                Phone
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type={loginMethod === "email" ? "email" : "tel"}
              name={loginMethod === "email" ? "email" : "phone"}
              value={loginMethod === "email" ? formData.email : formData.phone}
              onChange={handleChange}
              placeholder={loginMethod === "email" ? "Email address" : "Phone number"}
              className="w-full p-3 border border-blue-300 rounded-xl
                         focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-blue-300 rounded-xl
                         focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-blue-600 to-blue-500
                         hover:opacity-90 transition-all"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full p-3 border border-blue-500 rounded-xl
                         text-blue-600 font-medium hover:bg-blue-50"
            >
              Create Vendor Account
            </button>
          </form>
        </div>

        {/* RIGHT – IMAGE */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center
                        bg-gradient-to-br from-blue-50 to-white p-10">
          <img src={discountLogo} alt="Logo" className="w-4/5 mb-6" />
          <h3 className="text-xl font-bold text-gray-800">Welcome Back</h3>
          <p className="text-gray-600 text-sm text-center">
            Manage your vendor account & offers
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
