import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./routes/Router";
import { AuthProvider } from './contexts/authContext'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
