import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";

export function Navigation() {
  const {user} = useContext(AuthContext);
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark" >
        <h1>ProperGes</h1>
        <div className="links">
          
            <Link to="/">Home</Link>

            

          {user ? (
            <>
              <Link to="/properties">Propiedades</Link>
              <Link to="/invite">Invite</Link>
              <Link to="/logout">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        
        </div>
        
      </nav>
     
    </div>
  );
}
