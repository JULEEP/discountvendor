import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFileExport,
  FaEdit,
  FaTrash,
  FaTimes,
  FaImage,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const PAGE_SIZE = 5;
const API_BASE_URL = "https://api.redemly.com/api/vendor";

const VendorCoupons = () => {
  const vendorId = localStorage.getItem("vendorId");

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Edit Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    discountPercentage: "",
    requiredCoins: "",
    validityDate: "",
    couponCodeType: "static",
    limitForSameUser: "",
    status: "pending",
  });

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ================= FETCH COUPONS =================
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/${vendorId}/coupons`);
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error("Fetch coupons error:", err);
      alert("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [vendorId]);

  // ================= EDIT COUPON =================
  const openEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    setEditForm({
      name: coupon.name || "",
      category: coupon.category || "",
      discountPercentage: coupon.discountPercentage || "",
      requiredCoins: coupon.requiredCoins || "",
      validityDate: coupon.validityDate
        ? new Date(coupon.validityDate).toISOString().split("T")[0]
        : "",
      couponCodeType: coupon.couponCodeType || "static",
      limitForSameUser: coupon.limitForSameUser || "",
      status: coupon.status || "pending",
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleUpdateCoupon = async () => {
    if (!currentCoupon?._id) return;

    // Basic validation
    if (!editForm.name || !editForm.discountPercentage || !editForm.validityDate) {
      alert("Name, discount, and validity date are required");
      return;
    }

    setEditLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-coupon/${currentCoupon._id}`,
        editForm,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        alert("Coupon updated successfully ✅");
        fetchCoupons(); // Refresh the list
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error("Update coupon error:", err);
      alert(err.response?.data?.message || "Failed to update coupon");
    } finally {
      setEditLoading(false);
    }
  };

  // ================= UPDATE COUPON IMAGE =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentCoupon?._id) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("couponImage", file);

      const response = await axios.put(
        `${API_BASE_URL}/update-coupon/${currentCoupon._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.message) {
        alert("Image updated successfully");
        fetchCoupons(); // Refresh the list
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  // ================= DELETE COUPON =================
  const openDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteModalOpen(true);
  };

  const handleDeleteCoupon = async () => {
    if (!couponToDelete?._id) return;

    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete-coupon/${couponToDelete._id}`
      );

      if (response.data.success) {
        alert("Coupon deleted successfully ✅");
        fetchCoupons(); // Refresh the list
        setDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Delete coupon error:", err);
      alert(err.response?.data?.message || "Failed to delete coupon");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ================= FILTER LOGIC =================
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.couponCode?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || c.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [coupons, search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredCoupons.length / PAGE_SIZE);
  const paginatedCoupons = filteredCoupons.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ================= EXPORT CSV =================
  const exportCSV = () => {
    const headers = [
      "Name",
      "Category",
      "Discount %",
      "Coins",
      "Code",
      "Status",
      "Validity",
    ];

    const rows = filteredCoupons.map((c) => [
      c.name,
      c.category,
      c.discountPercentage,
      c.requiredCoins,
      c.couponCode,
      c.status,
      new Date(c.validityDate).toLocaleDateString(),
    ]);

    const csv = headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vendor-coupons.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (status) => {
    const map = {
      approved: "bg-green-100 text-green-800 border border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
      expired: "bg-gray-200 text-gray-800 border border-gray-300",
      used: "bg-purple-100 text-purple-800 border border-purple-200",
      deleted: "bg-gray-100 text-gray-500 border border-gray-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100"
          }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Coupons</h1>
          <p className="text-gray-600 text-sm">
            Manage and track your created coupons
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 bg-white text-blue-700 border border-blue-300 px-4 py-2 rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
          >
            <FiRefreshCw />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition-all"
          >
            <FaFileExport />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-blue-100 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            className="pl-10 pr-4 py-2.5 w-full border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="border border-blue-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
          <option value="used">Used</option>
          <option value="deleted">Deleted</option>
        </select>

        <select
          className="border border-blue-200 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Categories</option>
          {[...new Set(coupons.map((c) => c.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          <span className="font-medium">{filteredCoupons.length}</span>
          <span className="ml-1">coupons found</span>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Coupon</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Category</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Discount</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Coins</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Code</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Validity</th>
                <th className="p-4 text-left text-sm font-semibold text-blue-900">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCoupons.map((c) => (
                <tr key={c._id} className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.couponImage || "/default-coupon.png"}
                        alt={c.name}
                        className="w-12 h-12 rounded-lg object-cover border border-blue-200"
                        onError={(e) => {
                          e.target.src = "/default-coupon.png";
                        }}
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{c.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-700">{c.discountPercentage}%</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{c.requiredCoins}</span>
                      <span className="text-xs text-gray-500">coins</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm bg-gray-50 rounded px-2 py-1">
                    {c.couponCode}
                  </td>
                  <td className="p-4">{statusBadge(c.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500 text-sm" />
                      <span className="text-sm">
                        {new Date(c.validityDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        disabled={c.status === "deleted"}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Edit Coupon"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(c)}
                        disabled={c.status === "deleted"}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Delete Coupon"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedCoupons.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">🎫</div>
              <p className="text-gray-500 text-lg">No coupons found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2.5 rounded-xl bg-white border border-blue-300 text-blue-700 font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page <span className="text-blue-700">{page}</span> of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2.5 rounded-xl bg-white border border-blue-300 text-blue-700 font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Edit Coupon</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={currentCoupon?.couponImage || "/default-coupon.png"}
                    alt="Coupon"
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                  <div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <FaImage />
                      <span>{imageUploading ? "Uploading..." : "Change Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              {["name", "category", "discountPercentage", "requiredCoins", "limitForSameUser"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field.includes("Percentage") || field.includes("Coins") ? "number" : "text"}
                    name={field}
                    value={editForm[field]}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validity Date
                </label>
                <input
                  type="date"
                  name="validityDate"
                  value={editForm.validityDate}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-blue-100 flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCoupon}
                disabled={editLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-red-100">
              <h3 className="text-xl font-bold text-gray-900">Delete Coupon</h3>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <FaTrash className="text-red-500 text-xl" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {couponToDelete?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Code: {couponToDelete?.couponCode}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                This coupon will be marked as "deleted" (soft delete). Are you sure you want to continue?
              </p>
            </div>

            <div className="p-6 border-t border-red-100 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                disabled={deleteLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {deleteLoading ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorCoupons;