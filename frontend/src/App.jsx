import { useState, useEffect } from 'react';

import { Navigation } from "./pages/Navigation";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/User/Login';
import Logout from './pages/User/Logout';
import Invite from './pages/User/components/Invite';
import Register from './pages/User/components/Register';
import ListUsers from './pages/User/ListUsers';

import ProtectedRoute from './components/ProtectedRoute';
import { Propiedades } from './pages/Properties/Propiedades';
import ListClients from './pages/Clients/ListClients';
import PropertyDetails from './pages/Properties/PropertyDetails';
import Calendar from './pages/Calendar/Calendar';
import Visits from './pages/Visits/Visits';
import ClientDetails from './pages/Clients/ClientDetails';

const App = () => {

    return (
      <>
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
                  <Route path='/properties/:id/'
                    element={
                      <ProtectedRoute>
                        <PropertyDetails />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path='/clients/'
                    element={
                      <ProtectedRoute>
                        <ListClients />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path='/clients/:id/'
                    element={
                      <ProtectedRoute>
                        <ClientDetails />
                      </ProtectedRoute>
                    } 
                  />

                  <Route path='/users/'
                    element={
                      <ProtectedRoute>
                        <ListUsers />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path='/calendar/'
                    element={
                      <ProtectedRoute>
                        <Calendar />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path='/visits/'
                    element={
                      <ProtectedRoute>
                        <Visits />
                      </ProtectedRoute>
                    } 
                  />
                  


                  <Route path='/login/' element={<Login />} />
                  <Route path='/logout/' element={<Logout />} />
                  <Route path='/register/' element={<Register />} />
                  
                  
                  
              </Routes>
              
          </Router >
        </UserProvider>
      
      </>
    )
}
export default App;
