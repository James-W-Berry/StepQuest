import React from "react";
import { UserContextProvider } from "./auth/UserContext";
import Main from "./components/Main";

function App() {
  return (
    <UserContextProvider>
      <Main />
    </UserContextProvider>
  );
}

export default App;
