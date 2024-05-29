import React, { useState } from 'react';
import './App.css';
import AddReglement from './AddReglement';

function App() {
  const [activeTab, setActiveTab] = useState('pieces');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pieces':
        return <AddReglement type="pieces" />;
      case 'paiements':
        return <AddReglement type="paiements" />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('pieces')}>Pièce à régler</button>
        <button onClick={() => setActiveTab('paiements')}>Paiements</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Tes;
