import React from "react";
import NotFoundPage from "./NotFoundPage";
import { Routes } from "react-router-dom";

const ErrorRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default ErrorRoutes;
