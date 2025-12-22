import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaImage } from "react-icons/fa";

const CreateCoupon = () => {
  const vendorId = localStorage.getItem("vendorId");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    discountPercentage: "",
    requiredCoins: "",
    validityDate: "",
    couponCodeType: "%",
    limitForSameUser: "1",
    couponImage: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://api.redemly.com/api/admin/categories");
      setCategories(res.data.categories || []);
      if (res.data.categories?.length) {
        setFormData((prev) => ({
          ...prev,
          category: res.data.categories[0].categoryName,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      await axios.post(
        `https://api.redemly.com/api/vendor/create-coupon/${vendorId}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Coupon created successfully");

      setFormData({
        name: "",
        category: categories[0]?.categoryName || "",
        discountPercentage: "",
        requiredCoins: "",
        validityDate: "",
        couponCodeType: "%",
        limitForSameUser: "1",
        couponImage: null,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-16 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Create Coupon
        </h1>
        <p className="mt-2 text-gray-600">
          Design and publish exclusive offers for your customers
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl shadow-xl p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg">
            <FaPlus />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Coupon Details
          </h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Coupon Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Coupon Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="New Year Discount"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Discount */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Discount %
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Coins */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Required Coins
            </label>
            <input
              type="number"
              name="requiredCoins"
              value={formData.requiredCoins}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Validity */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Valid Till
            </label>
            <input
              type="date"
              name="validityDate"
              value={formData.validityDate}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Limit */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Limit / User
            </label>
            <input
              type="number"
              name="limitForSameUser"
              value={formData.limitForSameUser}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mt-8">
          <label className="text-sm font-medium text-gray-600">
            Coupon Image
          </label>
          <label className="mt-2 flex items-center justify-center gap-3 border-2 border-dashed border-purple-300 rounded-2xl p-6 cursor-pointer hover:bg-purple-50 transition">
            <FaImage className="text-purple-600" />
            <span className="text-sm text-gray-600">
              Click to upload coupon image
            </span>
            <input
              type="file"
              name="couponImage"
              accept="image/*"
              onChange={handleChange}
              required
              hidden
            />
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
