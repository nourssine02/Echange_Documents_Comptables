import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadFile = ({isSidebarOpen}) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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
      navigate('/fichePaie');
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
            <br />
            <br />
            <div className="mb-5">
              <div className="input-group" style={{ maxWidth: "500px" }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control mr-4"
                />
                <button
                  className="btn btn-dark"
                  onClick={handleUpload}
                >
                  Import Fiche Excel
                </button>
              </div>
            </div>
            <Link to="/uploadFile" className="btn btn-link">Voir Table Pointage</Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
