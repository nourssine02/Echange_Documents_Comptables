import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Connexion/UserProvider';

const Requetes = ({isSidebarOpen}) => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
  
  return (
    <div className="main-panel">
    <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Interrogations et Requêtes</h2>
              <br /> <br /> <br />
              <div className="col-md-12 d-flex justify-content-between">
              <Link to={"/TotalCommandesParPeriode"}>
                <button type="button" className="btn btn-success">
                  Total Commandes Par Periode
                </button>
              </Link>

              <Link to={"/ListeClientsParPeriodeCreation"}>
                <button type="button" className="btn btn-success">
                Liste Des Clients Par Periode de Creation
                </button>
              </Link>
              
              <Link to={"/EtatDeFacturation"}>
                <button type="button" className="btn btn-success">
                  Etat De Facturation
                </button>
              </Link>

              </div>
              
            
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Requetes
