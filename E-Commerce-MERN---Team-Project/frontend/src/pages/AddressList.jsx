import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import AddressForm from "./AddressForm";
import { MdEdit, MdDelete } from "react-icons/md";

const AddressList = ({ refreshTrigger }) => {
  const [addresses, setAddresses] = useState([]);
  const [editingLabel, setEditingLabel] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // for modal

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/address");
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosInstance.delete(`/address/${deleteTarget}`);
      setSuccessMessage("Address deleted successfully!");
      fetchAddresses();
    } catch (error) {
      setSuccessMessage(error.response?.data?.message || "Failed to delete address.");
    } finally {
      setDeleteTarget(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEdit = (label) => {
    const addrToEdit = addresses.find((addr) => addr.label === label);
    setEditingLabel(label);
    setEditingData(addrToEdit);
    setSuccessMessage("Edit mode activated!");
    setTimeout(() => setSuccessMessage(""), 3000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingLabel(null);
    setEditingData(null);
  };

  return (
    <div className="mt-6 space-y-6">
      {editingLabel && (
        <AddressForm
          initialData={editingData}
          labelToEdit={editingLabel}
          onAddressAdded={fetchAddresses}
          onCancelEdit={cancelEdit}
        />
      )}

      {successMessage && (
        <div className="mb-4 text-green-600 bg-green-100 border border-green-300 rounded-md px-4 py-2">
          {successMessage}
        </div>
      )}

      <h2 className="text-xl font-semibold">📦 Saved Addresses</h2>
      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found.</p>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr.label}
            className={`p-4 border rounded shadow relative ${
              addr.isDefault ? "border-green-500" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold capitalize">{addr.label} Address</p>
                <p><strong>State:</strong> {addr.state}</p>
                <p><strong>City:</strong> {addr.city}</p>
                <p><strong>Pincode:</strong> {addr.pincode}</p>
                <p><strong>Street No.:</strong> {addr.streetNo}</p>
                <p><strong>House No.:</strong> {addr.houseNo}</p>
                {addr.isDefault && <p className="text-green-600 font-semibold">Default Address</p>}
              </div>

              <div className="flex gap-3 mt-1 text-xl">
                <button
                  onClick={() => handleEdit(addr.label)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  title="Edit"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => setDeleteTarget(addr.label)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                  title="Delete"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-cyan-700/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this address?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;
