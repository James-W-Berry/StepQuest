import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
  Dispatch,
} from "react";

interface IAuthenticatedUserProviderProps {
  children: ReactNode;
}

interface IAuthenticatedUserContext {
  authenticatedUser: any;
  setAuthenticatedUser: Dispatch<SetStateAction<any>>;
}

const initialUserContext: IAuthenticatedUserContext = {
  authenticatedUser: {},
  setAuthenticatedUser: () => {},
};

const AuthenticatedUserContext = createContext<IAuthenticatedUserContext>(
  initialUserContext
);

export const AuthenticatedUserContextProvider = (
  props: IAuthenticatedUserProviderProps
) => {
  const [authenticatedUser, setAuthenticatedUser] = useState({
    loggedIn: null,
    isLoading: true,
    email: null,
    userId: null,
  });

  const userContextValue: IAuthenticatedUserContext = {
    authenticatedUser,
    setAuthenticatedUser,
  };

  return (
    <AuthenticatedUserContext.Provider value={userContextValue}>
      {props.children}
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuthenticatedUserContext = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(
    AuthenticatedUserContext
  );
  if (authenticatedUser === undefined || setAuthenticatedUser === undefined) {
    throw new Error(
      `useAuthenticatedUserContext: must be used within AuthenticatedUserContext.Provider`
    );
  }
  return { authenticatedUser, setAuthenticatedUser };
};
