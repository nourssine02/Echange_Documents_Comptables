import React, { useEffect, useState } from "react";
import axios from "axios";

const FacturesNonPayee = () => {
  const [factures, setFactures] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the unpaid invoices and companies when the component mounts or the selected company changes
    const fetchFacturesNonPayees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/factures-non-payees", {
          params: { company: selectedCompany || undefined },
        });
        setFactures(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching unpaid invoices:", err);
        setError("Une erreur est survenue lors de la récupération des factures non payées.");
        setLoading(false);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/clients"); // Assuming there's an endpoint to fetch companies
        setCompanies(response.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchFacturesNonPayees();
    fetchCompanies();
  }, [selectedCompany]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h3 className="text-center">Factures non payées</h3>
                <br />
                {/* Company Selection Dropdown */}
                <div className="d-flex justify-content-center mb-3">
                  <select
                    className="form-control form-control-sm w-auto"
                    value={selectedCompany}
                    style={{color: "black"}}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="">Toutes les Entreprises</option>
                    {companies.map((company) => (
                      <option key={company.code_entreprise} value={company.code_entreprise}>
                        {company.code_entreprise} - {company.identite}
                      </option>
                    ))}
                  </select>
                </div>
                <br />
                {factures.length === 0 ? (
                  <p className="text-center">Aucune facture non payée trouvée.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID Facture</th>
                          <th>Date Facture</th>
                          <th>Client</th>
                          <th>Montant Total</th>
                          <th>Etat Payement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {factures.map((facture) => (
                          <tr key={facture.id}>
                            <td>{facture.id}</td>
                            <td>{new Date(facture.date_facture).toLocaleDateString()}</td>
                            <td>{facture.client}</td>
                            <td>{facture.montant_total_facture} DT</td>
                            <td>{facture.etat_payement ? "Payée" : "Non Payée"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturesNonPayee;
