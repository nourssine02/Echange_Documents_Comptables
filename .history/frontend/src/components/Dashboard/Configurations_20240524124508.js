import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Configurations = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    const fetchTaxRates = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tax-rates');
        setTaxRates(response.data);
      } catch (error) {
        console.error('Error fetching tax rates:', error);
      }
    };
    fetchTaxRates();
  }, []);


  const addTaxRate = async () => {
    try {
      await axios.post('http://localhost:5000/taux_retenue_source', { rate: newRate });
      setNewRate('');
      fetchTaxRates();
    } catch (error) {
      console.error('Error adding tax rate:', error);
    }
  };

  const toggleTaxRate = async (id, active) => {
    try {
      await axios.put(`http://localhost:5000/taux_retenue_source/${id}`, { active: !active });
      fetchTaxRates();
    } catch (error) {
      console.error('Error toggling tax rate:', error);
    }
  };
  
  return (
    <div className="main-panel">
    <div className="content-wrapper">
      <h1>Gestion des Taux de Retenue à la Source</h1>
      <div>
        <input
          type="text"
          value={newRate}
          onChange={(e) => setNewRate(e.target.value)}
          placeholder="Nouveau taux"
        />
        <button onClick={addTaxRate}>Ajouter</button>
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
              <td>{rate.active ? 'Oui' : 'Non'}</td>
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
  );
};


export default Configurations;
