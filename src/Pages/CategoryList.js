import React, { useEffect, useState } from "react";
import { FaFileCsv, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import axios from "axios";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("https://credenhealth.onrender.com/api/admin/getallcategory")
      .then((res) => {
        setCategories(res.data); // <-- updated to match new API response format
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(worksheet);

      console.log("Imported Categories:", imported);
      alert("Category data imported successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleEdit = (id) => {
    console.log(`Edit category with ID: ${id}`);
    // Implement modal or navigation here
  };

  const handleDelete = (id) => {
    console.log(`Delete category with ID: ${id}`);
    setCategories(categories.filter((cat) => cat._id !== id));
    // Optional: Make DELETE request to backend
  };

  const headers = [
    { label: "Category Name", key: "name" },
    { label: "Description", key: "description" },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category List</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          className="px-3 py-2 border rounded text-sm"
          placeholder="Search by category name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <CSVLink
          data={filteredCategories}
          headers={headers}
          filename="category_list.csv"
          className="px-4 py-2 bg-green-500 text-white rounded text-sm flex items-center gap-2"
        >
          <FaFileCsv /> CSV
        </CSVLink>

        <label
          htmlFor="import-cat"
          className="px-4 py-2 bg-purple-600 text-white rounded text-sm flex items-center gap-2 cursor-pointer"
        >
          <FaUpload /> Bulk Import
          <input
            type="file"
            accept=".xlsx, .xls"
            id="import-cat"
            onChange={handleBulkImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border text-left">Category Name</th>
              <th className="p-2 border text-left">Description</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-100 border-b">
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border">{cat.description || "-"}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(cat._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
