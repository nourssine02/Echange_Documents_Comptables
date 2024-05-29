import React, { useState } from 'react';
import { MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

const CustomAutocomplete = ({ data, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = data.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filtered);
    onSearchChange(value);
  };

  const handleSelectItem = (item) => {
    setSearchTerm(item);
    setFilteredData([]);
    onSearchChange(item);
  };

  return (
    <div className="custom-autocomplete">
      <MDBInput
        label="Rechercher..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {filteredData.length > 0 && (
        <ul className="autocomplete-list">
          {filteredData.map((item, index) => (
            <li key={index} onClick={() => handleSelectItem(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
      <MDBBtn rippleColor='dark'>
        <MDBIcon icon='search' />
      </MDBBtn>
    </div>
  );
};

export default CustomAutocomplete;
