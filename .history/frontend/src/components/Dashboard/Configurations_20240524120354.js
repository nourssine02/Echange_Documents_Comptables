import React from "react";

const Configurations = () => {
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Livraisons</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addLivraison">
                    <button type="button" className="btn btn-info">
                      Ajouter 
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm"></table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations;
