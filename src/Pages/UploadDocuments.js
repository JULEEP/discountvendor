import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";

const UploadDocuments = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    aadhaarCard: null,
    panCard: null,
    gstCertificate: null,
    businessLicense: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.aadhaarCard ||
      !formData.panCard ||
      !formData.gstCertificate ||
      !formData.businessLicense
    ) {
      alert("Please upload all the required documents.");
      return;
    }

    const vendorId = localStorage.getItem("vendorId");
    if (!vendorId) {
      alert("Vendor ID not found. Please login again.");
      return;
    }

    const uploadedFiles = new FormData();
    uploadedFiles.append("aadhaarCard", formData.aadhaarCard);
    uploadedFiles.append("panCard", formData.panCard);
    uploadedFiles.append("gstCertificate", formData.gstCertificate);
    uploadedFiles.append("businessLicense", formData.businessLicense);

    try {
      const response = await axios.post(
        `http://31.97.206.144:6098/api/vendor/upload-documents/${vendorId}`,
        uploadedFiles,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Documents uploaded successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("Error uploading documents. Please try again.");
    }
  };

  const renderUploadField = (label, name) => (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
      <label className="text-gray-700 font-medium text-center">{label}</label>
      <label
        htmlFor={name}
        className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg cursor-pointer hover:bg-blue-700 transition"
      >
        <FaUpload size={14} /> Upload
      </label>
      <input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
      {formData[name] && (
        <span className="text-[11px] text-gray-500 text-center mt-1 truncate w-40">
          {formData[name].name}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-3xl w-full"
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Upload Vendor Documents
        </h1>

        <h2 className="text-lg font-medium mb-6 text-center text-blue-900 flex items-center justify-center gap-2">
          <FaUpload /> Document Upload Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderUploadField("Aadhaar Card", "aadhaarCard")}
          {renderUploadField("PAN Card", "panCard")}
          {renderUploadField("GST Certificate", "gstCertificate")}
          {renderUploadField("Business License", "businessLicense")}
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-purple-900 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm shadow-md"
          >
            Submit Documents
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDocuments;
