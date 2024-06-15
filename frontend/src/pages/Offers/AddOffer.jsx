import { useState, useEffect } from "react";
import { getClients } from "../../utils/api";
import Spinner from "../../components/Spinner";
import api from "../../utils/api";
import Select from "react-select";
import { formatToCurrency } from "../../utils/property_utils";
import { NumericFormat } from 'react-number-format';
import { useToast } from "rc-toastr";

const AddOffer = ({ client, onClose, onOfferCreated, offerToEdit }) => {
    const {toast} = useToast();
    const [propiedades, setPropiedades] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    
    const [formData, setFormData] = useState({
        offer_id:  offerToEdit ? offerToEdit.offer_id :"",
        property: offerToEdit ? offerToEdit.property :"",
        client: offerToEdit ? offerToEdit.client :"",
        offered_price: offerToEdit ? offerToEdit.offered_price : "",
        comments: offerToEdit ? offerToEdit.comments : "",
    });
    const [loading, setLoading] = useState(true);


    const propertyOptions = propiedades.map((propiedad) => ({
        value: propiedad.property_id,
        label: `${propiedad.reference} - ${propiedad.place_name} - ${formatToCurrency(propiedad.price)}`
    }));


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!offerToEdit){
            const updatedPropertyId = selectedProperty ? selectedProperty.value : null;
            const updatedClientId = selectedClient ? selectedClient.value : null;

            const updatedFormData = { 
                ...formData, 
                property: updatedPropertyId, 
                client: updatedClientId, 
            };
            
            
            // send to API
            try {
                const response = await api.post('/offers/', updatedFormData);
                
                if (response.status === 201) {
                    onOfferCreated();
                    onClose();
                } 
            } catch (error) {
                toast.error('Ha ocurrido un error al añadir la oferta');
            }
        } else {
            
            const updatedPropertyId = selectedProperty ? selectedProperty.value : null;
            const updatedClientId = selectedClient ? selectedClient.value : null;

            const updatedFormData = { 
                ...formData, 
                property: updatedPropertyId, 
                client: updatedClientId, 
            };
            
            // send edited offer to API
            try {
                const response = await api.patch(`/offers/${offerToEdit.offer_id}/`, updatedFormData);

                if (response.status === 200) {
                    onOfferCreated();
                    onClose();
                } 
            } catch (error) {
                toast.error('Ha ocurrido un error al guardar los cambios');
            }
        }

    }

    useEffect(() => {
        // get properties
        const getProperties = () => {
            api.get(`/properties/`)
                .then((response) => {
                    if ( offerToEdit ) {
                        const initialProperty = (response.data).find(prop => prop.property_id === offerToEdit.property);
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
            if(offerToEdit){
                const initialClient = data.find(client => client.client_id === offerToEdit.client);
                if (initialClient){
                    setSelectedClient({ value: initialClient.client_id, label: initialClient.iden_client });
                } else {
                    setSelectedClient(null);
                }
            }
        }).catch((error) => {
            toast.error("Error al cargar los clientes");
        });
        setTimeout(() => {
            setLoading(false);
        }, 1500);
       
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
                                    className="max-w-xs md:max-w-full"
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
                                    className="max-w-xs md:max-w-full"
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
                        <div className="form-group mt-1">
                            <label> Precio ofertado: {" "}
                                
                                <NumericFormat
                                    className="w-fit focus:border-blue-500 focus:border-2"
                                    thousandSeparator={true}
                                    suffix={'€'}
                                    allowNegative={false}
                                    placeholder="Indica el precio"
                                    value={formData.offered_price}
                                    onValueChange={(values) => {
                                        const {formattedValue, value} = values;
                                        setFormData({
                                            ...formData,
                                            offered_price: value
                                        });
                                    }}
                                    required
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Comentarios: {" "}
                                <textarea
                                    className="border min-h-20 w-full border-gray-300 rounded-md p-2 focus:border-blue-500 focus:border-2"
                                    value={formData.comments}
                                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                                    name="comments"
                                    placeholder="Comentarios sobre la oferta..."
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

export default AddOffer;