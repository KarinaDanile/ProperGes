import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import ListUsers from "./User/ListUsers";


const Home = () => {
    const {user} = useContext(AuthContext);


    return (
        <div>
            <h1>Home</h1>
            <span>Welcome to the home page</span>{user && <span>, {user}</span>}
            
        </div>
    )
}

export default Home;