// Layout.js
import React from "react";
import Header from "./Header";
import Contents from "./Contents";
import Footer from "./Footer";

function AppLayout({ children }) {
    return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <Contents>{children}</Contents>
      <Footer />
    </div>
    );
}

export default AppLayout;
