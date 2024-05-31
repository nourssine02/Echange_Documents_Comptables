import React, { useState } from 'react';
import axios from 'axios';

const PointageForm = () => {
  const [formData, setFormData] = useState({
    dateSaisie: '',
    codeTiers: '',
    heuresTravaillees: '',
    heuresAbsence: '',
    supplementRecu: '',
    sommesRecues: '',
    avancesADeduire: '',
    remboursementsPrets: '',
    autreDeduction: '',
    observations: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/pointage', formData);
      alert('Pointage saved successfully!');
      setFormData({
        dateSaisie: '',
        codeTiers: '',
        heuresTravaillees: '',
        heuresAbsence: '',
        supplementRecu: '',
        sommesRecues: '',
        avancesADeduire: '',
        remboursementsPrets: '',
        autreDeduction: '',
        observations: '',
      });
    } catch (error) {
      console.error(error);
      alert('Error saving pointage.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date de Saisie</label>
        <input type="date" name="dateSaisie" value={formData.dateSaisie} onChange={handleChange} required />
      </div>
      <div>
        <label>Code Tiers</label>
        <input type="text" name="codeTiers" value={formData.codeTiers} onChange={handleChange} required />
      </div>
      <div>
        <label>Heures Travaillees</label>
        <input type="number" name="heuresTravaillees" value={formData.heuresTravaillees} onChange={handleChange} required />
      </div>
      <div>
        <label>Heures d'Absence</label>
        <input type="number" name="heuresAbsence" value={formData.heuresAbsence} onChange={handleChange} required />
      </div>
      <div>
        <label>Supplement Recu</label>
        <input type="number" name="supplementRecu" value={formData.supplementRecu} onChange={handleChange} required />
      </div>
      <div>
        <label>Sommes Recues</label>
        <input type="number" name="sommesRecues" value={formData.sommesRecues} onChange={handleChange} required />
      </div>
      <div>
        <label>Avances à Deduir</label>
        <input type="number" name="avancesADeduire" value={formData.avancesADeduire} onChange={handleChange} required />
      </div>
      <div>
        <label>Remboursements Prêts</label>
        <input type="number" name="remboursementsPrets" value={formData.remboursementsPrets} onChange={handleChange} required />
      </div>
      <div>
        <label>Autre Déduction</label>
        <input type="number" name="autreDeduction" value={formData.autreDeduction} onChange={handleChange} required />
      </div>
      <div>
        <label>Observations</label>
        <input type="text" name="observations" value={formData.observations} onChange={handleChange} required />
      </div>
      <button type="submit">Save Pointage</button>
    </form>
  );
};

export default PointageForm;
