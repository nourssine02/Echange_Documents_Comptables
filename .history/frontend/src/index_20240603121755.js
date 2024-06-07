import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./components/Connexion/UserProvider";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
