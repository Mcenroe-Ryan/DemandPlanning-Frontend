import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthPages from "./screens/Login";


createRoot(document.getElementById("app")).render(
  <StrictMode>
    <AuthPages />
  </StrictMode>
);


