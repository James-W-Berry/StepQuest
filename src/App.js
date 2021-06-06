import React from "react";
import { AuthenticatedUserContextProvider } from "./auth/AuthenticatedUserContext";
import Main from "./components/Main";
import { UserContextProvider } from "./components/pages/User/UserContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import colors from "./assets/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.stepitup_blue,
    },
  },
});

function App() {
  return (
    <AuthenticatedUserContextProvider>
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </UserContextProvider>
    </AuthenticatedUserContextProvider>
  );
}

export default App;
