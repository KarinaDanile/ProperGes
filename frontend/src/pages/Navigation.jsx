import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useState, useEffect, useRef } from "react";

export function Navigation() {
  const {user} = useContext(AuthContext);
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      //const isClickOnAvatar = e.target.classList.contains('avatar') || e.target.parentElement?.classList.contains('avatar');
      if(!e.target.closest('.avatar') && sidebarRef.current ){
        setsidebarOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, []);

  const toggleSidebar = () => {
    setsidebarOpen(!sidebarOpen);
  }

  /*
      <NavLink to="/invite">Invite</NavLink>
      <NavLink to="/users">Usuarios</NavLink>
      <NavLink to="/register">Register</NavLink>
  */

  return (
    <>
      <nav>
        <h1 className="text-xl italic">ProperGes</h1>
        <div className="links">
          
          {user && (
            <div className="links">
              <NavLink 
                className={( {isActive }) => isActive ? 'text-blue-800 link' : 'link'}
                to="/">Home</NavLink>
              <NavLink 
                className={( {isActive }) => isActive ? 'text-blue-800 link' : 'link'}
                to="/properties">Propiedades</NavLink>
              <NavLink 
                className={( {isActive }) => isActive ? 'text-blue-800 link' : 'link'}
                to="/clients">Clientes</NavLink>
            </div>
          )}
        
        </div>
        { user && (
          <div className="avatar" onClick={() => toggleSidebar()}>
            <span className="cursor-default" onClick={() => toggleSidebar()} >{user.charAt(0).toUpperCase()}</span>
          </div>
        )}
        { sidebarOpen && (
          <div ref={sidebarRef} className="userSettings">
            <NavLink to="/settings">Configuración</NavLink>
            <NavLink to="/invite">Invite</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink className="border-t" to="/logout">Cerrar sesión</NavLink>
          </div>
        )}
        
        

      </nav>
     
    </>
  );
}
