import { useState, useEffect } from "react"
import { getUsers } from "../../utils/api";
import Spinner from "../../components/Spinner";
import ChangePassword from "./components/ChangePassword";
import { useToast } from "rc-toastr";
import { updateUser, deleteUser } from "../../utils/api";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmModal from "../../components/ConfirmModal";

export default function ListUsers() {
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const is_admin = JSON.parse(localStorage.getItem('userData')).is_admin;
    const username = localStorage.getItem('user');

    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data);
        }).catch((error) => {
            toast.error("Error al cargar los usuarios");
        }).finally(() =>{
            setLoading(false);
        });
        
    }, []);

    const handleDeactivateAccount = async (userId) => {
        try {
            setLoading(true);
            const updatedUser = await updateUser(userId, { is_active: false });
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === userId ? updatedUser : user))
            );
            toast.success("Cuenta desactivada con éxito")
        } catch (error) {
            toast.error("Error al desactivar la cuenta");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePermissions = async (userId, isAdmin) => {
        try {
            setLoading(true);
            const updatedUser = await updateUser(userId, { is_admin: !isAdmin });
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === userId ? updatedUser : user))
            );
            toast.success("Permisos cambiados con éxito");
        } catch (error) {
            toast.error("Error al cambiar los permisos");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (userId) => {
        try {
            setLoading(true);
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            toast.success("Usuario eliminado con éxito");
        } catch (error) {
            toast.error("Error al eliminar el usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            { loading ? (
                <Spinner />
            ) : (
                <>

                    <ConfirmModal 
                        isOpen={isDeleteModalOpen} 
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteAccount}
                        client={userToDelete}  
                        accion="Eliminar cuenta"
                        mensaje="¿Estás seguro que deseas eliminar esta cuenta? Esta acción no se puede deshacer."  
                    />

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
                            {is_admin &&
                                <th>Acciones</th>
                            }
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
                                {is_admin &&
                                <>
                                    { username !== user.username & 'admin' !== user.username ?
                                        <td className="flex justify-center">
                                            <button 
                                                className="py-1 text-sm border p-2 border-gray-300 rounded-md bg-gray-50 hover:shadow"  
                                                style={{maxWidth:"118px"}}
                                                onClick={() => handleDeactivateAccount(user.id)}
                                            >
                                                Desactivar cuenta
                                            </button>
                                            
                                            <button 
                                                className="py-1 text-sm ml-2 border p-2 border-gray-300 rounded-md bg-gray-50 hover:shadow" 
                                                style={{maxWidth:"118px"}}
                                                onClick={() => handleChangePermissions(user.id, user.is_admin)}
                                            >
                                                Cambiar permisos
                                            </button>
                                            <button
                                                className=" text-red-800 ml-2 border p-3 border-gray-300 rounded-md bg-gray-50 hover:shadow"
                                                
                                                onClick={() => {
                                                    setUserToDelete(user.id);
                                                    setIsDeleteModalOpen(true);
                                                
                                                }}
                                            >
                                                 <RiDeleteBinLine />
                                            </button>
                                        </td>
                                    : <td></td>
                                
                                    }
                                </>
                                }
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