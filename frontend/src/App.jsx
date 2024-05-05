import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigation } from "./pages/Navigation";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Invite from './pages/Invite';

import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';


const App = () => {

  /*const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const access_token = Cookies.get('access_token');
    setIsAuth(!!access_token);
  }, [isAuth]);*/

    return (
      <main>
        <UserProvider>
          <Router>
              <Navigation  />
              
              <Routes>
                  <Route path="/" 
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/login/" element={<Login />} />
                  <Route path='/logout/' element={<Logout />} />
                  <Route path='/register/' element={<Register />} />
                  <Route path='/invite/' element={<Invite />} />
                  
              </Routes>
          </Router >
        </UserProvider>
      </main>
    )
}
export default App;




/*
function App() {
  const [pingResponse, setPingResponse] = useState(null)

  useEffect(() => {
    fetchPing();
  },[]);

  const fetchPing = async () => {
    try{
      const response = await axios.get('http://localhost:8000/api/ping/');
      setPingResponse(response.data.message);
    } catch (error) {
      console.error( 'Error fetching ping:', error);
    }
  };

  return (
    <>
      <div>
        <h1>Ping-Pong App</h1>
        {pingResponse !== null 
        ?( 
          <p>{pingResponse}</p> 
        ):( 
          <p>Loading...</p>
        )}
      </div>
    </>
  )
}

export default App
*/