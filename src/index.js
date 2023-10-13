import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Store } from "./app/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider 
      clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID} 
      onScriptLoadError={() => {
        console.log("gsi script loaded error")
      }}
      onScriptLoadSuccess={() => {
        console.log("gsi script loaded")
      }}
    >
      <Provider store={Store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
