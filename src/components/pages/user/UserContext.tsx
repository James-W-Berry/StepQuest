import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
  Dispatch,
} from "react";

interface IUserProviderProps {
  children: ReactNode;
}

interface IUserContext {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

const initialUserContext: IUserContext = {
  user: {},
  setUser: () => {},
};

const UserContext = createContext<IUserContext>(initialUserContext);

export const UserContextProvider = (props: IUserProviderProps) => {
  const [user, setUser] = useState({
    profilePictureUrl: null,
    displayName: null,
    activeChallenges: null,
    badges: null,
  });

  const userContextValue: IUserContext = { user, setUser };

  return (
    <UserContext.Provider value={userContextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const { user, setUser } = useContext(UserContext);
  if (user === undefined || setUser === undefined) {
    throw new Error(`useUserContext: must be used within UserContext.Provider`);
  }
  return { user, setUser };
};
