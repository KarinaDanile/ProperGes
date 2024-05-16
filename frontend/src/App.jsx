import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigation } from "./pages/Navigation";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/User/Login';
import Logout from './pages/User/Logout';
import Invite from './pages/User/Invite';
import Register from './pages/User/Register';

import ProtectedRoute from './components/ProtectedRoute';
import { Propiedades } from './pages/Properties/Propiedades';



const App = () => {

    return (
      <main>
        <UserProvider>
          <Router>
              <Navigation  />
              <Routes>
                  <Route path='/' 
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path='/invite/'
                    element={
                      <ProtectedRoute>
                        <Invite />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path='/properties/'
                    element={
                      <ProtectedRoute>
                        <Propiedades />
                      </ProtectedRoute>
                    } 
                  />


                  <Route path='/login/' element={<Login />} />
                  <Route path='/logout/' element={<Logout />} />
                  <Route path='/register/' element={<Register />} />
                  
                  
              </Routes>
          </Router >
        </UserProvider>
      </main>
    )
}
export default App;
