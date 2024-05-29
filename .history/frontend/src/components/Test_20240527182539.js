import React, { useState } from 'react';

function Test() {
  const [activeTab, setActiveTab] = useState('facture');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facture':
        return <LignesDeFacture />;
      case 'comptables':
        return <EcrituresComptables />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('facture')}>Lignes de facture</button>
        <button onClick={() => setActiveTab('comptables')}>Écritures comptables</button>
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

function Aur() {
  return (
    <div>
      <h2>Écritures comptables</h2>
      {/* Contenu spécifique pour Écritures comptables */}
    </div>
  );
}

function Paiements() {
  return (
    <div>
      <h2>Paiements</h2>
      {/* Contenu spécifique pour Écritures comptables */}
    </div>
  );
}



export default Test;
