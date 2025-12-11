import { useState, useEffect } from "react";
import axios from "axios";
import { FiEye } from "react-icons/fi"; // import eye icon

const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getStatusStyle = () =>
    "bg-green-100 text-green-700"; // You can customize status & colors later

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
                  <th className="py-2 px-4 border">File</th>
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
                      {doc.type
                        .replace(/([A-Z])/g, " $1") // split camelCase by spaces
                        .replace(/^./, (str) => str.toUpperCase())}
                    </td>
                    <td className="py-2 px-4 border text-blue-600 underline cursor-pointer">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                        <FiEye size={18} />
                      </a>
                    </td>
                    <td className="py-2 px-4 border">{formatDate(doc.uploadedAt)}</td>
                    <td className="py-2 px-4 border">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}
                      >
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
    </div>
  );
};

export default DocumentTable;
