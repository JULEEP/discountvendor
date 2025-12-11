import React, { useState } from "react";
import axios from "axios";

const CategoryForm = ({ closeModal }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const response = await axios.post("https://credenhealth.onrender.com/api/admin/create-category", {
        name: categoryName,
        description: description.trim(),
      });

      if (response.status === 201 || response.status === 200) {
        alert("Category created successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Create Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Category Name</label>
          <input
            className="p-2 border rounded w-full"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Description (optional)</label>
          <textarea
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            rows="3"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-red-700 bg-red-100 border border-red-600 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-blue-700 bg-blue-100 border border-blue-600 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
