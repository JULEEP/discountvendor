import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloudUpload, Eye, EyeOff } from "lucide-react";

const VendorRegistration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [addresses, setAddresses] = useState([{ street: "", city: "", zipcode: "" }]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tillNumber: "",
    businessName: "",
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "", // New field
    note: "",
    businessLogo: null,
  });

  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // onChange handler for form fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    
    // Clear password error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // Handle address changes
  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  // Add new address field
  const addAddress = () => {
    setAddresses([...addresses, { street: "", city: "", zipcode: "" }]);
  };

  // Remove address field
  const removeAddress = (index) => {
    if (addresses.length > 1) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
    }
  };

  // Handle file upload with cloud icon
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, businessLogo: file });
    }
  };

  // Validate passwords match
  const validatePasswords = () => {
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  // Registration API
  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.password || !formData.tillNumber) {
      alert("Please fill all required fields (marked with *).");
      return;
    }

    if (!formData.confirmPassword) {
      alert("Please confirm your password.");
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    if (!formData.businessLogo) {
      alert("Please upload a Business Logo.");
      return;
    }

    // Validate addresses
    const validAddresses = addresses.every(addr => 
      addr.street.trim() && addr.city.trim() && addr.zipcode.trim()
    );
    
    if (!validAddresses) {
      alert("Please fill all address fields.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // Append form data (except confirmPassword)
      Object.keys(formData).forEach((key) => {
        if (key !== "confirmPassword" && formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      
      // Append addresses as JSON string
      data.append("addresses", JSON.stringify(addresses));

      const res = await axios.post(
        "https://api.redemly.com/api/vendor/register",
        data
      );

      setToken(res.data.token);
      alert("Vendor registered! Please enter the OTP sent to your email.");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  // OTP verification API
  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      alert("Enter a valid OTP.");
      return;
    }

    setOtpLoading(true);

    try {
      await axios.post(
        "https://api.redemly.com/api/vendor/verify-otp",
        { token, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("OTP Verified! Vendor Activated.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "OTP Verification Failed!");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-yellow-200 to-blue-300 p-4">
      <div className="w-full max-w-5xl p-6 rounded-3xl shadow-2xl 
                      backdrop-blur-xl bg-white/60 border border-white/40">
        
        {/* TITLE */}
        <h2 className="text-4xl font-bold text-center mb-6 
                       bg-gradient-to-r from-blue-700 to-yellow-600 
                       bg-clip-text text-transparent">
          Vendor Registration
        </h2>

        {/* ---------------- STEP 1 : REGISTRATION ---------------- */}
        {step === 1 && (
          <>
            <div className="space-y-6">
              
              {/* Row 1: First Name, Last Name, Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    onChange={handleChange}
                    value={formData.firstName}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    onChange={handleChange}
                    value={formData.lastName}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    onChange={handleChange}
                    value={formData.email}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                </div>
              </div>

              {/* Row 2: Phone, Till Number, Business Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number *"
                    onChange={handleChange}
                    value={formData.phone}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required (10 digits)</p>
                </div>

                <div>
                  <input
                    type="text"
                    name="tillNumber"
                    placeholder="Till Number *"
                    onChange={handleChange}
                    value={formData.tillNumber}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                </div>

                <div>
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    onChange={handleChange}
                    value={formData.businessName}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Optional</p>
                </div>
              </div>

              {/* Row 3: Latitude, Longitude */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="latitude"
                    placeholder="Latitude"
                    onChange={handleChange}
                    value={formData.latitude}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Optional</p>
                </div>

                <div>
                  <input
                    type="text"
                    name="longitude"
                    placeholder="Longitude"
                    onChange={handleChange}
                    value={formData.longitude}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Optional</p>
                </div>

                <div>
                  {/* Empty column for spacing */}
                </div>
              </div>

              {/* Row 4: Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password *"
                      onChange={handleChange}
                      value={formData.password}
                      className="w-full px-4 py-3 rounded-xl border border-blue-300 
                                 bg-white/70 backdrop-blur 
                                 focus:ring-2 focus:ring-blue-400 
                                 focus:border-blue-500 outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required (min 6 characters)</p>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password *"
                      onChange={handleChange}
                      value={formData.confirmPassword}
                      className="w-full px-4 py-3 rounded-xl border border-blue-300 
                                 bg-white/70 backdrop-blur 
                                 focus:ring-2 focus:ring-blue-400 
                                 focus:border-blue-500 outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                </div>
              </div>

              {/* Password error message */}
              {passwordError && (
                <div className="p-3 text-red-600 bg-red-100 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              {/* Row 5: Optional Note Field */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <textarea
                    name="note"
                    placeholder="Additional Notes (Optional)"
                    onChange={handleChange}
                    value={formData.note}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 
                               bg-white/70 backdrop-blur 
                               focus:ring-2 focus:ring-blue-400 
                               focus:border-blue-500 outline-none transition-all
                               resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">Optional - Add any additional information</p>
                </div>
              </div>

              {/* Addresses Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">Addresses *</h3>
                {addresses.map((address, index) => (
                  <div key={index} className="p-4 border border-blue-200 rounded-xl bg-white/50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-blue-600">Address {index + 1} *</span>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddress(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Street *"
                          value={address.street}
                          onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-blue-300 
                                     bg-white/70 backdrop-blur focus:ring-2 
                                     focus:ring-blue-400 focus:border-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City *"
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-blue-300 
                                     bg-white/70 backdrop-blur focus:ring-2 
                                     focus:ring-blue-400 focus:border-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Zip Code *"
                          value={address.zipcode}
                          onChange={(e) => handleAddressChange(index, 'zipcode', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-blue-300 
                                     bg-white/70 backdrop-blur focus:ring-2 
                                     focus:ring-blue-400 focus:border-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1 ml-1">Required</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addAddress}
                  className="w-full py-3 border-2 border-dashed border-blue-400 
                             rounded-xl text-blue-600 hover:bg-blue-50 
                             transition-colors font-medium"
                >
                  + Add Another Address
                </button>
              </div>

              {/* File Upload with Cloud Icon */}
              <div>
                <label className="block font-semibold text-blue-700 mb-2">Business Logo *</label>
                <div className="relative">
                  <input
                    type="file"
                    id="businessLogo"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="businessLogo"
                    className="flex flex-col items-center justify-center 
                               w-full p-8 border-2 border-dashed border-blue-400 
                               rounded-xl cursor-pointer bg-white/70 
                               hover:bg-blue-50 transition-colors"
                  >
                    <CloudUpload className="w-16 h-16 text-blue-500 mb-3" />
                    <span className="text-blue-600 font-medium text-lg">
                      {formData.businessLogo 
                        ? formData.businessLogo.name 
                        : "Click to upload business logo"}
                    </span>
                    <span className="text-gray-500 text-sm mt-2">
                      Drag & drop or click to upload (Max: 5MB)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-1">Required - JPG, PNG, or GIF format</p>
                </div>
              </div>

            </div>

            {/* REGISTER BUTTON */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-8 py-4 rounded-xl text-white font-bold shadow-lg 
                         bg-gradient-to-r from-blue-600 to-yellow-500 
                         hover:opacity-90 active:scale-95 transition-all 
                         disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-gray-700 mt-6 font-medium">
              Already have an account?
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 py-3 rounded-xl text-blue-700 border border-blue-500 
                         font-semibold bg-white/70 backdrop-blur
                         hover:bg-blue-50 active:scale-95 transition-all"
            >
              Login
            </button>
          </>
        )}

        {/* ---------------- STEP 2 : OTP ---------------- */}
        {step === 2 && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">OTP Verification</h3>
            <p className="text-gray-700 mb-4">Enter the OTP sent to your email.</p>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-400 
                         bg-white/80 text-center text-xl tracking-widest 
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full mt-6 py-3 rounded-xl text-white font-bold 
                         shadow-lg bg-gradient-to-r from-blue-700 to-green-500 
                         hover:opacity-90 active:scale-95 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* BACK TO LOGIN BUTTON */}
            <button
              onClick={() => navigate("/")}
              className="w-full mt-4 py-2 rounded-xl text-blue-700 
                         border border-blue-500 bg-white/70 backdrop-blur
                         hover:bg-blue-50 active:scale-95 transition-all"
            >
              Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VendorRegistration;