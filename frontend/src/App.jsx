import { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigation } from "./pages/Navigation";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Cookies from 'js-cookie';
//<Route path="/user/logout/" element={< Logout />} />

const App = () => {

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const access_token = Cookies.get('access_token');
    setIsAuth(!!access_token);
  }, [isAuth]);

    return (
      <main>
        <Router>
            <Navigation isAuth={isAuth} />
            
            <Routes>
                <Route exact path="/" element={< Home />} />
                <Route path="/user/login/" element={<Login setauth={setIsAuth} />} />
                <Route path='/user/logout/' element={<Logout setauth={setIsAuth} />} />
            </Routes>
        </Router >
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