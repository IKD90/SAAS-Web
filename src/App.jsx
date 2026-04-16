import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Common/Header";
import Footer from "./Components/Common/Footer";
import Login from "./Forms/Login";
import Signup from "./Forms/Signup";
import Builder from "./Builder/Builder";
import VideoConferencing from "./pages/VideoConferencing.jsx";
import VideoCall from "./pages/VideoCall.jsx";
import Ecommerce from "./Product Pages/E-commerce.jsx";
import Dashboard from "./Product Pages/Dashboard.jsx";
import Storefront from "./Product Pages/Storefront.jsx";
import HealthCareSolutions from "./Product Pages/HealthCareSolutions.jsx"; // New Healthcare Solutions page
import Services from "./pages/Services.jsx"; // New Services page
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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/video-conferencing" element={
            <RequireAuth>
              <VideoConferencing />
            </RequireAuth>
          } />
          <Route path="/video-call/:roomId" element={
            <RequireAuth>
              <VideoCall />
            </RequireAuth>
          } />
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

          <Route path="/store/:domain" element={<Storefront />} />
          <Route path="/products/healthcare" element={<HealthCareSolutions />} />
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

