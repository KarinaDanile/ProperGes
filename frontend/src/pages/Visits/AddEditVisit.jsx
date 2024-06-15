
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/api";
import Select from "react-select";
import { formatToCurrency, capitalize } from "../../utils/property_utils";
import { getClients, getUsers } from "../../utils/api";
import Spinner from "../../components/Spinner";
import { useToast } from "rc-toastr";

export default function AddEditVisit({client, onClose, onVisitCreated, visitToEdit }){
    const { toast } = useToast();
    const [propiedades, setPropiedades] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [formData, setFormData] = useState({
        property_id:  visitToEdit ? visitToEdit.property_id :"",
        client_id: visitToEdit ? visitToEdit.client_id :"",
        agent_id: visitToEdit ? visitToEdit.agent_id :"",
        start: visitToEdit ? visitToEdit.start : new Date(),
        comments: visitToEdit ? visitToEdit.comments : "",
    });
    const [loading, setLoading] = useState(true);

    const propertyOptions = propiedades.map((propiedad) => ({
        value: propiedad.property_id,
        label: `${propiedad.reference} - ${propiedad.place_name} - ${formatToCurrency(propiedad.price)}`
    }));

    const formatDateTimeForDB = (date) => {
        if (!date) return '';

        if(typeof date === 'string' && isValidISODate(date)){
            return date;
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:00`;
    }

    const isValidISODate = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
        return regex.test(dateString);
    };

    /*
        <input
            name="start"
            type="datetime-local"
            value={formData.start}
            onChange={handleChange}
            required
        />
    */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!visitToEdit){
            // update dateTime format for DB
            const formattedDate = formatDateTimeForDB(formData.start);
            const updatedPropertyId = selectedProperty ? selectedProperty.value : null;
            const updatedClientId = selectedClient ? selectedClient.value : null;
            const updatedAgentId = selectedAgent ? selectedAgent.value : null;

            const updatedFormData = { 
                ...formData, 
                start: formattedDate, 
                property_id: updatedPropertyId, 
                client_id: updatedClientId, 
                agent_id: updatedAgentId
            };
            
            // send to API
            try {
                const response = await api.post('/visits/', updatedFormData);

                if (response.status === 201) {
                    onVisitCreated();
                    onClose();
                } 
            } catch (error) {
                toast.error('Ha ocurrido un error al añadir la visita');
            }
        } else {
            // update dateTime format for DB
            const formattedDate = formatDateTimeForDB(formData.start);
            const updatedPropertyId = selectedProperty ? selectedProperty.value : null;
            const updatedClientId = selectedClient ? selectedClient.value : null;
            const updatedAgentId = selectedAgent ? selectedAgent.value : null;

            const updatedFormData = { 
                ...formData, 
                start: formattedDate, 
                property_id: updatedPropertyId, 
                client_id: updatedClientId, 
                agent_id: updatedAgentId
            };

            
            // send edited visit to API
            try {
                const response = await api.patch(`/visits/${visitToEdit.visit_id}/`, updatedFormData);

                if (response.status === 200) {
                    onVisitCreated();
                    onClose();
                } 
            } catch (error) {
                toast.error('Ha ocurrido un error al editar la visita');
            }
        }

    }

    useEffect(() => {
        // get properties
        const getProperties = () => {
            api.get(`/properties/`)
                .then((response) => {
                    if ( visitToEdit ) {
                        const initialProperty = (response.data).find(prop => prop.property_id === visitToEdit.property_id);
                        if (initialProperty){
                            setSelectedProperty({ value: initialProperty.property_id, label: `${initialProperty.reference} - ${initialProperty.place_name} - ${formatToCurrency(initialProperty.price)}` });
                        } else{
                            setSelectedProperty(null);
                        }
                    }
                    setPropiedades(response.data);
                }).catch((error) => {
                    toast.error("Error al cargar las propiedades");
                });
        }
        getProperties();

        // get clients
        getClients().then((data) => {
            setClients(data);
            if(visitToEdit){
                const initialClient = data.find(client => client.client_id === visitToEdit.client_id);
                if (initialClient){
                    setSelectedClient({ value: initialClient.client_id, label: initialClient.iden_client });
                } else {
                    setSelectedClient(null);
                }
            }
        }).catch((error) => {
            toast.error("Error al cargar los clientes");
        });
            
        
        // get agents
        getUsers().then((data) => {
            setAgents(data);
            if(visitToEdit){
                const initialAgent = data.find(agent => agent.id === visitToEdit.agent_id);
                if (initialAgent){
                    setSelectedAgent({ value: initialAgent.id, label: capitalize(initialAgent.username) });
                } else {
                    setSelectedAgent(null);
                }
            }
        }).catch((error) => {
            toast.error("Error al cargar los usuarios");
        });
        setTimeout(() => {
            setLoading(false);
        },1500);
       
    }, [])



    return (
        <>
        {loading ? <Spinner />
        
        : 
            <div className="formWrapper">
                <div className="addForm w-3/6">
                    <h3 className="text-xl border-b-2 mb-4">Añadir nueva visita</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Propiedad: {" "}
                                <Select 
                                    placeholder="Selecciona una propiedad"
                                    required
                                    value={selectedProperty}
                                    onChange={(selectedOption) => {
                                        setSelectedProperty(selectedOption);                                        
                                    }}
                                    options={propertyOptions}
                                    isClearable
                                />
                                    
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Cliente: {" "}
                                <Select
                                    placeholder="Selecciona un cliente"
                                    required
                                    value={selectedClient}
                                    onChange={(selectedOption) => {
                                        setSelectedClient(selectedOption);
                                    }}
                                    options={clients.map((client) => ({
                                        value: client.client_id,
                                        label: client.iden_client
                                    }))}
                                    isClearable
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Agente: {" "}
                                <Select
                                    placeholder="Selecciona un agente"
                                    required
                                    value={selectedAgent}
                                    onChange={(selectedOption) => {
                                        setSelectedAgent(selectedOption);
                                    }}
                                    options={agents.map((agent) => ({
                                        value: agent.id,
                                        label: capitalize(agent.username)
                                    }))}
                                    isClearable
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Fecha y hora: {" "}
                                

                                <DatePicker
                                    selected={formData.start}
                                    onChange={(date) => {setFormData({...formData, start: date})}}
                                    timeInputLabel="Hora:"
                                    dateFormat="dd/MM/yyyy h:mm aa"
                                    showTimeInput
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Comentarios: {" "}
                                <textarea
                                    className="border w-full border-gray-300 rounded-md p-2"
                                    value={formData.comments}
                                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                                    name="comments"
                                    placeholder="Comentarios sobre la visita..."
                                />
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="btn-cancel"
                                onClick={() => onClose()}
                            >Cerrar</button>

                            <button 
                                className="btn-save"
                                disabled={loading}
                                type="submit"
                            >Guardar
                            </button>
                        </div>
                        
                    </form>
                </div>
                
            </div>
        }
        </>
    )
}