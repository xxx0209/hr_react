import AppRoutes from './routes/AppRoutes';
import Layout from "./pages/Layout";
// import './index.css';
import './App.css';
import React, { useState } from "react";

function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
