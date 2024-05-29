import React, { useState } from 'react';
import './App.css';

function Tes() {
  const [activeTab, setActiveTab] = useState('facture');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facture':
        return <LignesDeFacture />;
      case 'comptables':
        return <EcrituresComptables />;
      case 'informations':
        return <AutresInformations />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('facture')}>Lignes de facture</button>
        <button onClick={() => setActiveTab('comptables')}>Écritures comptables</button>
        <button onClick={() => setActiveTab('informations')}>Autres informations</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

function LignesDeFacture() {
  return (
    <div>
      <h2>Lignes de facture</h2>
      {/* Contenu spécifique pour Lignes de facture */}
    </div>
  );
}

function EcrituresComptables() {
  return (
    <div>
      <h2>Écritures comptables</h2>
      {/* Contenu spécifique pour Écritures comptables */}
    </div>
  );
}

function AutresInformations() {
  return (
    <div>
      <h2>Autres informations</h2>
      {/* Contenu spécifique pour Autres informations */}
    </div>
  );
}

export default Test;
