import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaFileExport } from "react-icons/fa";

const PAGE_SIZE = 5;

export default function VendorCouponsTable() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const vendorId = localStorage.getItem("vendorId");

    if (!vendorId) {
      setError("Vendor ID not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchVendorCoupons = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://31.97.206.144:6098/api/vendor/mycoupons/${vendorId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();
        setCoupons(data.coupons || []);
        setTotalCoupons(data.total || data.coupons.length || 0);
      } catch (err) {
        setError(err.message || "Error fetching coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorCoupons();
  }, []);

  // Filter coupons whenever `statusFilter`, `searchTerm`, or `coupons` change
  useEffect(() => {
    let filtered = coupons;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.category.toLowerCase().includes(term) ||
          c.couponCode.toLowerCase().includes(term) ||
          c.status.toLowerCase().includes(term)
      );
    }

    setFilteredCoupons(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [statusFilter, searchTerm, coupons]);

  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredCoupons.length / PAGE_SIZE);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const getStatusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      available: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      used: "bg-purple-100 text-purple-800",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          map[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setNewStatus(coupon.status);
    setIsModalOpen(true);
  };

  const updateCouponStatus = async () => {
    if (!selectedCoupon || !newStatus) return;

    try {
      const res = await fetch(
        `http://31.97.206.144:6098/api/vendor/update-coupon-status/${selectedCoupon._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === selectedCoupon._id ? { ...c, status: newStatus } : c
        )
      );

      setIsModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Name", "Category", "Discount", "Code", "Status", "Validity", "Created", "Required Coins"];
    
    const csvContent = [
      headers.join(","),
      ...filteredCoupons.map(coupon => 
        [
          `"${coupon.name.replace(/"/g, '""')}"`,
          coupon.category,
          coupon.discountPercentage,
          coupon.couponCode,
          coupon.status,
          formatDate(coupon.validityDate),
          formatDate(coupon.createdAt),
          coupon.requiredCoins
        ].join(",")
      )
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my_coupons.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-sm text-red-700">{error}</p>
        <div className="mt-2">
          <Link
            to="/login"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Coupons</h1>
          <p className="text-sm text-gray-600">List of all coupons created by you.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          {/* ✅ Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search coupons..."
              className="border border-gray-300 rounded px-3 py-2 text-sm pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* ✅ Filter Dropdown */}
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="available">Available</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="used">Used</option>
          </select>

          {/* ✅ Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            disabled={filteredCoupons.length === 0}
          >
            <FaFileExport />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Total: {filteredCoupons.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Coupon</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Validity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCoupons.length > 0 ? (
              paginatedCoupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{coupon.name}</div>
                        <div className="text-gray-500 text-sm">{coupon.requiredCoins} coins</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 capitalize">{coupon.category}</td>
                  <td className="px-4 py-4 text-sm text-blue-600 font-medium">
                    {coupon.discountPercentage}%
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-gray-700">{coupon.couponCode}</td>
                  <td className="px-4 py-4 text-sm">{getStatusBadge(coupon.status)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatDate(coupon.validityDate)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{formatDate(coupon.createdAt)}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center px-4 py-10 text-gray-500">
                  <p>No coupons found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Update Coupon Status</h2>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="available">Available</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
              <option value="used">Used</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateCouponStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}