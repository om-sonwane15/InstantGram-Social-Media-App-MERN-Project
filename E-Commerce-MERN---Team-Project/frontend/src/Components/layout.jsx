// Layout.jsx
import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/NavBar";
import { SidebarProvider } from "../context/SidebarContext";

const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <div className="sticky top-0 z-10">
            <Navbar />
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;