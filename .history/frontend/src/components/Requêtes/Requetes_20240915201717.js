import React from 'react'
import { Link } from 'react-router-dom';
//import { UserContext } from '../Connexion/UserProvider';

const Requetes = ({isSidebarOpen}) => {
   // const { setUser } = useContext(UserContext);
  
  return (
    <div className="main-panel">
    <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Liste des Requêtes</h2>
              <br /> <br /> <br />
              <div className="col-md-12 d-flex justify-content-between">
              <Link to={"/TotalCommandesParPeriode"}>
                <button type="button" className="btn btn-link">
                  Total Commandes Par Periode
                </button>
              </Link>

              <Link to={"/ListeClientsParPeriodeCreation"}>
                <button type="button" className="btn btn-link">
                Liste Des Clients Par Periode de Creation
                </button>
              </Link>
              
              <Link to={"/EtatDeFacturation"}>
                <button type="button" className="btn btn-link">
                  Etat De Facturation
                </button>
              </Link>

              </div>
              <br />

              <div className="col-md-12 d-flex justify-content-between">
              <Link to={"/TotalCommandesParPeriode"}>
                <button type="button" className="btn btn-link">
                    Commandes detaillees Par Periode
                </button>
              </Link>

              <Link to={"/ListeClientsParPeriodeCreation"}>
                <button type="button" className="btn btn-link">
                    Rechercher Commandes par code client
                </button>
              </Link>
              
              <Link to={"/EtatDeFacturation"}>
                <button type="button" className="btn btn-link">
                   Livraisons Prevues
                </button>
              </Link>
              

              </div>

              <br />

<div className="col-md-12 d-flex justify-content-between">
<Link to={"/TotalCommandesParPeriode"}>
  <button type="button" className="btn btn-link">
      Et
  </button>
</Link>

<Link to={"/ListeClientsParPeriodeCreation"}>
  <button type="button" className="btn btn-link">
      Rechercher Commandes par code client
  </button>
</Link>

<Link to={"/EtatDeFacturation"}>
  <button type="button" className="btn btn-link">
     Livraisons Prevues
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
