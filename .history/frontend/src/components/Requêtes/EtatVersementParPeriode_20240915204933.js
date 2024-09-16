import React from "react";
import { Link } from "react-router-dom";

const EtatVersementParPeriode = ({ isSidebarOpen }) => {
  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Link style={{ fontSize: "25px" }} to="/requetes">
                  <i className="bi bi-arrow-left-circle"></i>
                </Link>
                <h2 className="text-center">
                  Total des commandes par période{" "}
                </h2>
                <br />
                <br />
                <br />

                <div className="d-flex justify-content-center mb-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtatVersementParPeriode;
