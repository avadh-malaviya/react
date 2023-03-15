import React from "react";
import ReactDOM from "react-dom";
import "admin-lte";
import "@fortawesome/fontawesome-free/css/all.css";
import "admin-lte/dist/css/adminlte.css";
import './App.scss';
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import Routes from "./routes";
import { AuthProvider } from './store/context';
global.Buffer = global.Buffer || require('buffer').Buffer

ReactDOM.render(
    <React.StrictMode>
	  	<AuthProvider>
        <Routes />
      </AuthProvider>
    </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
