import React, { useState } from "react";
import axios from "axios";

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/pointage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
