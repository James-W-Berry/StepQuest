import React from "react";
import { AuthenticatedUserContextProvider } from "./auth/AuthenticatedUserContext";
import Main from "./components/Main";
import { UserContextProvider } from "./components/pages/User/UserContext";

function App() {
  return (
    <AuthenticatedUserContextProvider>
      <UserContextProvider>
        <Main />
      </UserContextProvider>
    </AuthenticatedUserContextProvider>
  );
}

export default App;
