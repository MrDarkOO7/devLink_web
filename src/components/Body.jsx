import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Body = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-grow min-h-[calc(100vh-8rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
