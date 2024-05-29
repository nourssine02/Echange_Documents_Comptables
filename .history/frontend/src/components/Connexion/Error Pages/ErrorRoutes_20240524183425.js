import React from "react";
import NotFoundPage from "./NotFoundPage";
import { Route, Router, Routes } from "react-router-dom";

const ErrorRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default ErrorRoutes;
