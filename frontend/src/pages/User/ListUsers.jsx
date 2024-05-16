import { useState, useEffect } from "react"
import { getUsers } from "../../utils/api";

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
                <span>Loading...</span>
            ) : (
                <>
                <h1>Usuarios</h1>
                <table border={1}>
                    <tr>
                        <th>Usuario</th>
                        <th>Correo electrónico</th>
                        <th>Teléfono</th>
                        <th>Cuenta activada</th>
                        <th>Permisos administrador</th>
                    </tr>
                
                    { users.map(user => (
                        <tr key={user.id} style={{border:'1px solid black'}}>
                            <td> <b>{user.username}</b> </td>
                            <td> {user.email} </td>
                            <td> {user.phone} </td>
                            <td> {user.is_active ? 'Yes' : 'No'} </td>
                            <td> {user.is_admin ? 'Yes' : 'No'} </td>
                            <td><button>Desactivar cuenta</button></td>
                            <td><button>Cambiar permisos</button></td>
                        </tr>
                    ))}
                </table>
                </>
            )}
            
            <p>Y todo el resultado:</p>
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </>
    )
}