import React from "react";
import Header from "../components/Header";
import Listing from "../components/Listing";

function AdminHomePage() {
  return (
    <div className="w-full">
      <Header />
      <div>
        <Listing />
      </div>
    </div>
  );
}

export default AdminHomePage;
