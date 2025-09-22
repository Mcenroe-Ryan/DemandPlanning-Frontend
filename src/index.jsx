import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthPages from "./screens/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/poppins"; 

// To Override MUI default theme
const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthPages />      
    </ThemeProvider>
  </StrictMode>
);
