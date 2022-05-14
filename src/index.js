import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import AWContext from "./AWContext";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AWContext>
      <App />
    </AWContext>
  </React.StrictMode>,
  document.getElementById("root")
);
