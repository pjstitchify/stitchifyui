import React from "react";
import { createRoot } from "react-dom/client";
import "./assets.js";   // MUST be imported before the components render (sets window._ICONS / window._D)
import "./index.css";

// Choose which app to render:
import MakeDesktop from "./MakeDesktop.jsx";
// import MakeMobile from "./MakeMobile.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MakeDesktop />
  </React.StrictMode>
);
