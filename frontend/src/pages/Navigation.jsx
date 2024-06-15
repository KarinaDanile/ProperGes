import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useState, useEffect, useRef } from "react";

export function Navigation() {
  const {user} = useContext(AuthContext);
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const [hovered, SetHovered] = useState(false);
  const sidebarRef = useRef();

  const handleMouseEnter = () => {
    SetHovered(true);
  };

  const handleMouseLeave = () => {
    SetHovered(false);
  };

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
                to="/">Inicio</NavLink>
              <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <NavLink 
                  className={( {isActive }) => isActive ? 'text-blue-800 link' : 'link'}
                  to="/properties">Propiedades</NavLink>

                  {hovered && (
                    <div className="absolute  py-2 bg-white  rounded w-36">
                        <NavLink to="/offers" className="block px-4 py-2 text-gray-700 relative after:block after:content-[''] after:relative after:h-[1px] after:bg-black after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                            Ofertas
                        </NavLink>
                        
                    </div>
                  )}
              </div>
              <NavLink 
                className={( {isActive }) => isActive ? 'text-blue-800 link' : 'link'}
                to="/clients">Clientes</NavLink>
                <NavLink 
                className={( {isActive }) => isActive ? 'text-blue-800 link' : 'link'}
                to="/calendar">Calendario</NavLink>
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
            
            <NavLink to="/users">Usuarios</NavLink>
            <NavLink to="/invite">Invitación</NavLink>
            <NavLink to="/register">Registro</NavLink>
            <NavLink className="border-t" to="/logout">Cerrar sesión</NavLink>
          </div>
        )}
        
        

      </nav>
     
    </>
  );
}
