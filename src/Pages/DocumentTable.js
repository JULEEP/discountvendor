import { useState, useEffect } from "react";
import axios from "axios";
import { FiEye, FiX } from "react-icons/fi";

const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        setError("Vendor ID not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://31.97.206.144:6098/api/vendor/get-documents/${vendorId}`
        );
        setDocuments(res.data.documents || []);
      } catch (err) {
        setError("Failed to load documents.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  };

  const isPDF = (url) => {
    return url.match(/\.pdf$/i);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
          Uploaded Documents
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading documents...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-green-100 text-gray-600">
                <tr>
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Document Name</th>
                  <th className="py-2 px-4 border">Preview</th>
                  <th className="py-2 px-4 border">Uploaded On</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {documents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-gray-500 text-center">
                      No documents uploaded yet.
                    </td>
                  </tr>
                )}

                {documents.map((doc, index) => (
                  <tr key={doc._id || index} className="text-center">
                    <td className="py-2 px-4 border">{index + 1}</td>

                    <td className="py-2 px-4 border font-medium">
                      {doc.type.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </td>

                    {/* View Button (Opens Modal) */}
                    <td
                      className="py-2 px-4 border text-blue-600 cursor-pointer hover:underline"
                      onClick={() => {
                        setSelectedFile(doc.url);
                        setShowModal(true);
                      }}
                    >
                      <FiEye size={18} className="mx-auto" />
                    </td>

                    <td className="py-2 px-4 border">{formatDate(doc.uploadedAt)}</td>

                    <td className="py-2 px-4 border">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Uploaded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* -------------------- MODAL -------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl max-w-3xl w-full relative">

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
              onClick={() => setShowModal(false)}
            >
              <FiX size={24} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">Document Preview</h3>

            {/* IMAGE PREVIEW */}
            {isImage(selectedFile) && (
              <img
                src={selectedFile}
                alt="Document"
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}

            {/* PDF PREVIEW */}
            {isPDF(selectedFile) && (
              <iframe
                src={selectedFile}
                title="PDF Preview"
                className="w-full h-[70vh] rounded-lg"
              ></iframe>
            )}

            {/* OTHER FILE TYPES */}
            {!isImage(selectedFile) && !isPDF(selectedFile) && (
              <div className="text-center py-10">
                <p className="text-gray-600">Cannot preview this file type.</p>
                <a
                  href={selectedFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Click to Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
