// Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default Layout;
