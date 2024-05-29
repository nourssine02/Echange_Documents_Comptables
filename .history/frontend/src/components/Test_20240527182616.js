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
    </div>
  );
}

function Autres_informations() {
  return (
    <div>
      <h2>Autres Informations</h2>
    </div>
  );
}

function Paiements() {
  return (
    <div>
      <h2>Paiements</h2>
    </div>
  );
}



export default Test;
