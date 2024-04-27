import React, { useEffect, useState } from "react";

import { Link, NavLink } from "react-router-dom";

export function Navigation({ isAuth }) {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark" >
        <h1>ProperGes</h1>
        <div className="links">
          {isAuth && 
            <Link to="/">Home</Link>
          }

          {isAuth ? (
            <Link to="/user/logout">Logout</Link>
          ) : (
            <Link to="/user/login">Login</Link>
          )}
        </div>
        
      </nav>
      <p>isAuth: {isAuth.toString()}</p>
    </div>
  );
}
