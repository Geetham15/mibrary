import { createContext } from "react";

const AuthenticationContext = createContext({
  userId: "",
  username: "",
  latitude: 0,
  longitude: 0,
  logIn: () => {},
  logOut: () => {},
});

export default AuthenticationContext;
