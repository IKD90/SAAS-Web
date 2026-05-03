import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Common/Header";
import Footer from "./Components/Common/Footer";
import NewsletterManager from "./Product Pages/NewsletterManagement.jsx";
import Login from "./Forms/Login";
import Signup from "./Forms/Signup";
import Builder from "./Builder/Builder";
import Meethub from "./Product Pages/Meethub.jsx";
import Ecommerce from "./Product Pages/E-commerce.jsx";
import Dashboard from "./Product Pages/Dashboard.jsx";
import Storefront from "./Product Pages/Storefront.jsx";
import HealthCareSolutions from "./Product Pages/HealthCareSolutions.jsx";
import FintechSolutions from "./Product Pages/FintechSolutions.jsx";
import EDtechSolutions from "./Product Pages/EDTechSolutions.jsx";
import RetailManagement from "./Product Pages/RetailManagement.jsx";
import WorkFlowAutomation from "./Product Pages/WorkFlowAutomation.jsx";
import DocumentManagement from "./Product Pages/DocumentManagement.jsx";
import TeamCollab from "./Product Pages/TeamCollab.jsx";
import ERPSolutions from "./Product Pages/ERPSolutions.jsx";
import APIManagement from "./Product Pages/APIManagement.jsx";
import AppMarketplace from "./Product Pages/AppMarketplace.jsx";
import HRManagement from "./Product Pages/HRManagement.jsx";
import Invoices from "./Product Pages/Invoices.jsx";
import Services from "./pages/Services.jsx";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Blogs from "./pages/Blogs";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import RequireAuth from "../src/Components/RequireAuth.jsx";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* E-commerce Routes */}
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/store/:domain" element={<Storefront />} />
          
          {/* Protected Routes */}
          <Route path="/builder" element={
            <RequireAuth>
              <Builder />
            </RequireAuth>
          } />
          
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />

          {/* Product Solutions Routes */}
          <Route path="/products/healthcare" element={<HealthCareSolutions />} />
          <Route path="/products/fintech" element={<FintechSolutions />} />
          <Route path="/products/edtech" element={<EDtechSolutions />} />
          <Route path="/products/retail" element={<RetailManagement />} />
          <Route path="/products/workflow" element={<WorkFlowAutomation />} />
          <Route path="/products/team-collaboration" element={<TeamCollab />} />
          <Route path="/products/document-management" element={<DocumentManagement />} />
          <Route path="/products/video-conference" element={<Meethub />} />
          <Route path="/products/api-management" element={<APIManagement />} />
          <Route path="/products/app-marketplace" element={<AppMarketplace />} />
          <Route path="/products/erp" element={<ERPSolutions />} />
          <Route path="/products/hr-management" element={<HRManagement />} />
          <Route path="/products/invoices" element={<Invoices />} />
          <Route path="/products/NewsletterManager" element={<NewsletterManager />} />
          
          {/* Redirect for old video conference path */}
          <Route path="/products/Video-Conference" element={<Navigate to="/products/video-conference" replace />} />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;