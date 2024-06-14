import { useState, useEffect } from "react"
import { getUsers } from "../../utils/api";
import Spinner from "../../components/Spinner";
import ChangePassword from "./components/ChangePassword";

export default function ListUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data);
        }).catch((error) => {
            console.error(error);
        }).finally(() =>{
            setLoading(false);
        });
        
    }, []);

    

    return (
        <>
            { loading ? (
                <Spinner />
            ) : (
                <>
                <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                    <h1>Usuarios</h1>
                </div>
                
                <div className="tableWrapper">
                <table border={1} className="my-table2">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Correo electrónico</th>
                            <th>Teléfono</th>
                            <th>Cuenta activa</th>
                            <th>Permisos administrador</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map(user => (
                            <tr 
                                className=" border-2 border-gray-200 bg-gray-50 hover:bg-gray-100"
                                key={user.id} 
                            >    
                                <td> <b>{user.username}</b> </td>
                                <td> {user.email} </td>
                                <td> {user.phone} </td>
                                <td> {user.is_active ? 'Yes' : 'No'} </td>
                                <td> {user.is_admin ? 'Yes' : 'No'} </td>
                                <td className="flex">
                                    <button className="py-1 text-sm"  style={{maxWidth:"118px"}}>Desactivar cuenta</button>
                                    <button className="py-1 text-sm ml-2" style={{maxWidth:"118px"}}>Cambiar permisos</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>


                <ChangePassword />

                </>
            )}
            
            
        </>
    )
}