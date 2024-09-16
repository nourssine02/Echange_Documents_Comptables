import React from 'react'
import { Link } from 'react-router-dom'

const LivraisonsPrevues = ({isSidebarOpen}) => {
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
              <h3 className="text-center">
                Livraisons Prévues{" "}
              </h3>
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
  )
}

export default LivraisonsPrevues
