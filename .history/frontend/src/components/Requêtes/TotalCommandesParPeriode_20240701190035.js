import React, { useState } from "react";
import axios from "axios";

const TotalCommandesParPeriode = ({ isSidebarOpen }) => {
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const fetchTotal = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/total-commandes-par-periode",
        {
          params: { startDate, endDate },
        }
      );
      if (response.data.length > 0) {
        setTotal(response.data[0].total);
      } else {
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching total commandes", error);
      setError("An error occurred while fetching the total commandes.");
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Total des Commandes par Période</h2>
                <br /> <br /> <br />
                
                <div className="d-flex justify-content-center mb-3">
                  <input
                    className="form-control mx-2"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    className="form-control mx-2"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <button className="btn btn-behance mx-2" onClick={fetchTotal}>
                    Fetch Total
                  </button>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <br />
                {total === 0 ? (
                  <h3 className="text-center">
                    Total des Commandes dans cette Période est égale à 0
                  </h3>
                ) : (
                  <h3 className="text-center">Total: {total}</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCommandesParPeriode;
