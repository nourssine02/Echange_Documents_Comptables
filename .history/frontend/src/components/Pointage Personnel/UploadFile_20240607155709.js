import React, { useState } from "react";
import axios from "axios";

const UploadFile = ({isSidebarOpen}) => {
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
            <h2 className="title text-center">Import Fichier Excel</h2>
            <br></br>
            <input
              type="file"
              className="form-control ml-5"
              onChange={handleFileChange}
            />
            <br />
            <button onClick={handleUpload} className="btn btn-dark">Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
