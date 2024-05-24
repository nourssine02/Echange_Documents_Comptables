import axios from "axios";
import React, { useState } from "react";

const Configurations = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [newRate, setNewRate] = useState("");

  const fetchTaxRates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/taux_retenue_source"
      );
      setTaxRates(response.data);
    } catch (error) {
      console.error("Error fetching tax rates:", error);
    }
  };

  const addTaxRate = async () => {
    try {
      await axios.post("http://localhost:5000/taux_retenue_source", {
        rate: newRate,
      });
      setNewRate("");
      fetchTaxRates();
    } catch (error) {
      console.error("Error adding tax rate:", error);
    }
  };

  const toggleTaxRate = async (id, active) => {
    try {
      await axios.put(`http://localhost:5000/taux_retenue_source/${id}`, {
        active: !active,
      });
      fetchTaxRates();
    } catch (error) {
      console.error("Error toggling tax rate:", error);
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <br></br>
                <h1>Taux de Retenue à la Source</h1>
                <br></br>
                <div>
                  <input
                    type="text"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="form-control"
                    placeholder="Nouveau taux de la retenue a la source"
                  />
                  <br></br>
                  <button onClick={addTaxRate} className="btn btn-info">
                    Ajouter
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Taux</th>
                      <th>Actif</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxRates.map((rate) => (
                      <tr key={rate.id}>
                        <td>{rate.id}</td>
                        <td>{rate.rate}%</td>
                        <td>{rate.active ? "Oui" : "Non"}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={rate.active}
                            onChange={() => toggleTaxRate(rate.id, rate.active)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations;
