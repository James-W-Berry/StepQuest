import React from "react";
import { AuthenticatedUserContextProvider } from "./auth/AuthenticatedUserContext";
import Main from "./components/Main";
import { UserContextProvider } from "./components/pages/User/UserContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import colors from "./assets/colors";
import { CssBaseline } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.almostBlack,
    },
    secondary: {
      main: colors.stepQuestYellow,
    },
    background: {
      main: colors.white,
    },
  },
  typography: {
    fontFamily: "Roboto",
    fontWeightRegular: 400,
  },
});

function App() {
  return (
    <AuthenticatedUserContextProvider>
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Main />
        </ThemeProvider>
      </UserContextProvider>
    </AuthenticatedUserContextProvider>
  );
}

export default App;
