import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

         
  );
};

export default UploadFile;
