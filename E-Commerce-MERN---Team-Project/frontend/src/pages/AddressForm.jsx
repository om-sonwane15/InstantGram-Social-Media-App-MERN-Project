import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { MdAddLocationAlt, MdEditLocationAlt } from "react-icons/md";

const AddressForm = ({
  onAddressAdded,
  initialData = null,
  labelToEdit = null,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    pincode: "",
    streetNo: "",
    houseNo: "",
    label: "home",
    isDefault: false,
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (labelToEdit) {
        await axiosInstance.put(`/address/${labelToEdit}`, formData);
        setSuccessMessage("Address updated successfully!");
      } else {
        await axiosInstance.post("/address", formData);
        setSuccessMessage("Address added successfully!");
      }

      setFormData({
        state: "",
        city: "",
        pincode: "",
        streetNo: "",
        houseNo: "",
        label: "home",
        isDefault: false,
      });

      onAddressAdded();
      if (onCancelEdit) onCancelEdit();

      // Clear the message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error.response?.data?.message || "Operation failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
        {labelToEdit ? (
          <>
            <MdEditLocationAlt className="text-cyan-600" />
            Edit Address
          </>
        ) : (
          <>
            <MdAddLocationAlt className="text-cyan-600" />
            Add New Address
          </>
        )}
      </h2>

      {successMessage && (
        <div className="mb-4 text-green-600 bg-green-100 border border-green-300 rounded-md px-4 py-2">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["state", "city", "pincode", "streetNo", "houseNo"].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              required
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Label</label>
          <select
            name="label"
            value={formData.label}
            onChange={handleChange}
            disabled={labelToEdit !== null}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="mr-2 cursor-pointer"
        />
        <label className="text-sm text-gray-700">Set as default address</label>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-lg transition-all cursor-pointer"
        >
          {labelToEdit ? "Update" : "Add"} Address
        </button>
        {labelToEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
