import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { Provider } from "./provider.tsx";
import "@/globals.css";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./main.layout.tsx";
import LoginScene from "./scenes/LoginScene/LoginScene.tsx";
import RegisterScene from "./scenes/RegisterScene/RegisterScene.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout width="300px" height="450px">
                <App />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout width="300px" height="450px">
                <LoginScene />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout width="300px" height="550px">
                <RegisterScene />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
);
