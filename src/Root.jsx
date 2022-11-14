/* eslint-disable global-require */
import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./hooks/web3Context";

import App from "./App";

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Web3ContextProvider>
          <BrowserRouter basename={"/#"}>
            <App />
          </BrowserRouter>
      </Web3ContextProvider>
    );
  }
}
