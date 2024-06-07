// src/components/UploadFile.js

import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/pointage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
  
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
        </div>
    );
};

export default UploadFile;
