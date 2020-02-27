import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { positions, Provider as AlertProvider } from "react-alert";
const options = {
  timeout: 25000,
  position: positions.TOP_RIGHT,
  containerStyle: {}
};

const AlertTemplate = ({ style, options, message }) => (
  <div style={style}>{message}</div>
);

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
