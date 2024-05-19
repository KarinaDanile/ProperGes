import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";

export function Navigation() {
  const {user} = useContext(AuthContext);
  return (
    <>
      <nav className="p-2">
        <h1 className="text-xl italic">ProperGes</h1>
        <div className="links">
          
          {user && (
            <>
              <Link className="link" to="/">Home</Link>
              <Link className="link" to="/properties">Propiedades</Link>
              <Link className="link" to="/clients">Clientes</Link>
            </>
          )}
        
        </div>
        { user && (
           <div className="avatar"
           onClick={
             () => {
               const userSettings = document.querySelector('.userSettings');
               if(userSettings.style.display === 'none') {
                 userSettings.style.display = 'flex';
               } else {
                 userSettings.style.display = 'none';}
             }
           }
         >
           <span>{user.charAt(0).toUpperCase()}</span>
           <div className="userSettings">
             <Link to="/invite">Invite</Link>
             <Link to="/users">Usuarios</Link>
             <Link to="/logout">Logout</Link>
             <Link to="/register">Register</Link>
 
           </div>
         </div>
        
        )}
       
          


      </nav>
     
    </>
  );
}
