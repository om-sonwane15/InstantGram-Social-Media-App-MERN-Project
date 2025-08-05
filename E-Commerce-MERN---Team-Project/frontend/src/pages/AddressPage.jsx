import React, { useState } from "react";
import AddressForm from "../pages/AddressForm";
import AddressList from "../pages/AddressList";

const AddressPage = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag(!refreshFlag); // toggle to force refresh
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <AddressForm onAddressAdded={triggerRefresh} />
      <AddressList key={refreshFlag} />
    </div>
  );
};

export default AddressPage;
