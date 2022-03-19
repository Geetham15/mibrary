import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import AuthenticationContext from "../AuthenticationContext";
import MustBeLoggedIn from "./MustBeLoggedIn";

function Header() {
  const authContext = useContext(AuthenticationContext);

  return (
    <>
      <div style={{ marginBottom: 50 }}>
        <header className="bg-blue-400  p-2 items-center flex justify-around  ">
          <NavLink exact to="/">
            <FontAwesomeIcon
              icon={faHome}
              className="  flex absolute top-2 mb-3 mt-1 left-10 text-5xl items-center "
            />
          </NavLink>

          <NavLink exact to="/about">
            <button className="flex absolute top-2 mb-3 mt-1 right-20  hover:bg-white rounded p-2 m-2">
              About
            </button>
          </NavLink>

          <h1
            className="flex absolute top-2 mb-3 mt-1 left-50 text-5xl items-center"
            style={{ fontSize: 40 }}
          >
            Mibrary
          </h1>

          <div>
            <MustBeLoggedIn>
              <NavLink exact to="/logout">
                <button
                  className="hover:bg-white rounded p-2 m-2"
                  onClick={authContext.logOut}
                >
                  LogOut
                </button>
              </NavLink>
            </MustBeLoggedIn>
            {authContext.username && <p>Hello {authContext.username}!</p>}

            {!authContext.username && (
              <NavLink exact to="./signup">
                <button className="hover:bg-white rounded p-2 m-2">
                  SignUp
                </button>
              </NavLink>
            )}
            <MustBeLoggedIn>
              <NavLink exact to="./userDashboard">
                <FontAwesomeIcon
                  icon={faUser}
                  className="  flex absolute top-2 right-10 mb-3 mt-1  text-5xl items-center "
                  cursor="pointer"
                />
              </NavLink>
            </MustBeLoggedIn>
          </div>
        </header>
      </div>
    </>
  );
}

export default Header;
