import React from "react";
import Router from "./Router/Router";
import { ToastProvider } from "./ToastProvider/ToastProvider";

function App(): React.JSX.Element {
  return (
    <div>
      <Router />
      <ToastProvider />
    </div>
  );
}

export default App;
