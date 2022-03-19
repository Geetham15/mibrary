import React, { useContext } from "react";
import AuthenticationContext from "../AuthenticationContext";

const MustBeLoggedIn = (props) => {
  const { children } = props;
  const authContext = useContext(AuthenticationContext);
  return authContext.username ? children : null;
};

export default MustBeLoggedIn;
