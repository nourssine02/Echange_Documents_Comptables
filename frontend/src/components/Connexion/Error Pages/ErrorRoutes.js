import React from "react";
import NotFoundPage from "./NotFoundPage";

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
