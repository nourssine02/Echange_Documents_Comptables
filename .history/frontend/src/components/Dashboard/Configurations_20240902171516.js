import axios from "axios";
import React, { useEffect, useState } from "react";

const Configurations = ({isSidebarOpen}) => {

  const [taxRates, setTaxRates] = useState([]);
  const [newRate, setNewRate] = useState("");
  const [editingRate, setEditingRate] = useState(null);
  const [updatedRate, setUpdatedRate] = useState("");

  const [banks, setBanks] = useState([]); 
  const [newBank, setNewBank] = useState("");
  const [editingBank, setEditingBank] = useState(null);
  const [updatedBank, setUpdatedBank] = useState("");


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

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const addTaxRate = async () => {
    try {
      await axios.post("http://localhost:5000/taux_retenue_source", {
        taux: newRate,
      });
      setNewRate("");
      fetchTaxRates();
    } catch (error) {
      console.error("Error adding tax rate:", error);
    }
  };

  const modifTaxRate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/taux_retenue_source/modif/${id}`, {
        taux: updatedRate,
      });
      setEditingRate(null);
      setUpdatedRate("");
      fetchTaxRates();
    } catch (error) {
      console.error("Error modifying tax rate:", error);
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

  const Annuler = () => {
    setEditingRate(null);
    setUpdatedRate("");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/taux_retenue_source/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce Taux ?"
    );
    if (confirmDelete) {
      handleDelete(id);
    }
  };



  const fetchBanks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/banques"
      );
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const addBank = async () => {
    try {
      await axios.post("http://localhost:5000/banques", {
        bank: newBank,
      });
      setNewBank("");
      fetchBanks();
    } catch (error) {
      console.error("Error adding Bank:", error);
    }
  };


  const modifBank = async (id) => {
    try {
      await axios.put(`http://localhost:5000/banques/modif/${id}`, {
        bank: updatedBank,
      });
      setEditingBank(null);
      setUpdatedBank("");
      fetchBanks();
    } catch (error) {
      console.error("Error modifying Bank:", error);
    }
  };

  const toggleBank = async (id, active) => {
    try {
      await axios.put(`http://localhost:5000/banques/${id}`, {
        active: !active,
      });
      fetchBanks();
    } catch (error) {
      console.error("Error toggling Bank:", error);
    }
  };

  const AnnulerBank = () => {
    setEditingRate(null);
    setUpdatedRate("");
  };
  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <br />
                <h1 className="text-center">Configurations</h1>
                <br></br><br></br>
        
                <h3 style={{textDecorationLine: "underline", color: "green"}}>- Taux de la Retenue à la Source</h3>
                <br />
                <div className="col-md-4">
                  <div className="form-group">
                    <input
                      type="text"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="form-control"
                      placeholder="Taux de la retenue à la source"
                    />
                  </div>
                  <button onClick={addTaxRate} className="btn btn-info mb-3">
                    Ajouter
                  </button>
                </div>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Taux</th>
                        <th>Actif</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxRates.map((rate) => (
                        <tr key={rate.id}>
                          <td>
                            {editingRate === rate.id ? (
                              <input
                                type="text"
                                value={updatedRate}
                                onChange={(e) => setUpdatedRate(e.target.value)}
                                className="form-control-sm"
                              />
                            ) : (
                              `${rate.taux}%`
                            )}
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              style={{ marginTop: "-1px" }}
                              checked={rate.active}
                              onChange={() =>
                                toggleTaxRate(rate.id, rate.active)
                              }
                              className="form-check-input"
                            />
                            {rate.active ? "Oui" : "Non"}
                          </td>
                          <td>
                            &nbsp;&nbsp;
                            {editingRate === rate.id ? (
                              <>
                                <button
                                  onClick={() => modifTaxRate(rate.id)}
                                  className="btn btn-success btn-sm"
                                >
                                  Enregistrer
                                </button>
                                &nbsp;
                                <button
                                  onClick={Annuler}
                                  className="btn btn-light btn-sm"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                              <button
                                onClick={() => {
                                  setEditingRate(rate.id);
                                  setUpdatedRate(rate.taux); // Charger la valeur existante
                                }}
                                className="btn btn-warning btn-sm mr-2"
                              >
                                Modifier
                              </button> 
                              <button
                              type="button"
                              onClick={() => confirmDelete(rate.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Supprimer
                            </button>
                            </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <br></br>
                <hr />
                <h3 style={{textDecorationLine: "underline", color: "green"}}>- Nom des Banques</h3>
                <br />
                <div className="col-md-4">
                  <div className="form-group">
                    <input
                      type="text"
                      value={newBank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="form-control"
                      placeholder="Nom des banques"
                    />
                  </div>
                  <button onClick={addBank} className="btn btn-info mb-3">
                    Ajouter
                  </button>
                </div>

                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>name</th>
                        <th>Actif</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banks.map((bank) => (
                        <tr key={bank.id}>
                          <td>
                            {editingBank === bank.id ? (
                              <input
                                type="text"
                                value={updatedBank}
                                onChange={(e) => setUpdatedBank(e.target.value)}
                                className="form-control-sm"
                              />
                            ) : (
                              `${bank.name}`
                            )}
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              style={{ marginTop: "-1px" }}
                              checked={bank.active}
                              onChange={() =>
                                toggleBank(bank.id, bank.active)
                              }
                              className="form-check-input"
                            />
                            {bank.active ? "Oui" : "Non"}
                          </td>
                          <td>
                            &nbsp;&nbsp;
                            {editingBank === bank.id ? (
                              <>
                                <button
                                  onClick={() => modifBank(bank.id)}
                                  className="btn btn-success btn-sm"
                                >
                                  Enregistrer
                                </button>
                                &nbsp;
                                <button
                                  onClick={AnnulerBank}
                                  className="btn btn-light btn-sm"
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                              <button
                                onClick={() => {
                                  setEditingBank(bank.id);
                                  setUpdatedBank(bank.name);
                                }}
                                className="btn btn-warning btn-sm mr-2"
                              >
                                Modifier
                              </button> 
                              <button
                              type="button"
                              onClick={() => confirmDelete(bank.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Supprimer
                            </button>
                            </>
                            )}
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
    </div>
  );
};

export default Configurations;
