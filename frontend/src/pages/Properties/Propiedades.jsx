import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import AddProperty from "./Components/AddProperty";
import Spinner from "../../components/Spinner";
import { capitalize, formatToCurrency, formatDateString, limitLines } from "../../utils/property_utils";
import { IoBed } from "react-icons/io5";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { LiaToiletSolid } from "react-icons/lia";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; 
import FilterForm from "./Components/FilterForm";
import api from "../../utils/api";  
import { useToast } from "rc-toastr";

export function Propiedades() {
    const {toast} = useToast();
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewState, setViewState] = useState('list');
    const [filters, setFilters] = useState({});
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [propertyCount, setPropertyCount] = useState(0);
    const pageSize = 10;

    const [orderLoading, setOrderLoading] = useState(false);

    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/properties/${id}/`);
    };

    const handleSortChange = (field) => {
        const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newSortOrder);
        setFilters(prevFilters => ({...prevFilters }));
        setOrderLoading(true);
    };
    
    const handleViewChange = (view) => {
        setViewState(view);
        getProperties1();
    };

    const fetchProperties = async (filters, viewState) => {

        setLoading(true);
        try {
            let data;
            if (viewState === 'list'){
                data = await getProperties(filters, viewState, currentPage);
                setPropiedades(data.results);
                setTotalPages(Math.ceil(data.count / pageSize));
                setNextPage(data.next);
                setPrevPage(data.previous);
            } else {
                data = await getProperties(filters, viewState);
                setPropiedades(data);
            }
        } catch (error) {
            toast.error("Error al cargar propiedades");
        } finally {
            setLoading(false);
        }
    };

    const getProperties = (filters, viewState, currentPage = 1) => {

        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                ...filters,
                ...(viewState === 'list' && { page: currentPage, page_size: pageSize }), 
                ordering: sortOrder === 'asc' ? sortField : `-${sortField}`,
            }).toString();

            api.get(`/properties/?${params}`)
                .then((response) => {

                    resolve(response.data);
                }).catch((error) => {
                    reject(error)
                });
            });
    }
    const getProperties1 = () => {

        const params = new URLSearchParams({
            ...filters,
            ...(viewState === 'list' && { page: currentPage, page_size: pageSize }), 
            ordering: sortOrder === 'asc' ? sortField : `-${sortField}`,
        }).toString();

        
        api.get(`/properties/?${params}`)
            .then((response) => {

                setPropertyCount(response.data.count);
                if(viewState === 'list'){
                    setPropiedades(response.data.results);
                    setTotalPages(Math.ceil(response.data.count / pageSize));
                    setNextPage(response.data.next);
                    setPrevPage(response.data.previous);
                }else{
                    setPropiedades(response.data);
                }
            }).catch((error) => {
                toast.error("Error al cargar propiedades");
            }).finally(() =>{
                setLoading(false);
                setOrderLoading(false);
            });
    };

    const handlefilterChange = (filters) => {

        setFilters(filters);
        setCurrentPage(1);
    };

    const handlePageChange = (pageUrl) => {
        if (!pageUrl) return;

        setLoading(true);
        api.get(pageUrl)
            .then((response) => {
                const data = response.data;
                setPropiedades(data.results);
                setTotalPages(Math.ceil(data.count / pageSize));
                setNextPage(data.next);
                setPrevPage(data.previous);
                setCurrentPage(pageUrl.includes('page=') ? parseInt(new URL(pageUrl).searchParams.get('page')) : 1);
            })
            .catch((error) => {
                toast.error("Error al cargar propiedades");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {   
        //fetchProperties(filters, viewState);
        getProperties1();
    }, []);
    
    useEffect(() => {   
        //fetchProperties(filters, viewState);
        setOrderLoading(true);
        getProperties1();
    }, [filters, viewState]);
    

    const renderSortIcon = (field) => {
        if (sortField !== field) return <div className="text-gray-400"><FaSort /></div>;
        if (sortOrder === 'asc') return <div className="text-gray-400"><FaSortDown /></div>;
        return <div className="text-gray-400"><FaSortUp /></div>;
    }

    return (
        <>
            { showModal ? <AddProperty updateProperties={() => fetchProperties(filters, viewState)} setShowModal={setShowModal} /> 
            : (
                <>
                    
                { loading ? <Spinner />
                : (
                    <>
                        <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                            <h1 className="p-5">Propiedades</h1>
                            <button
                                className="btn-add"
                                onClick={() => setShowModal(true)}
                            >Añadir propiedad
                            </button> 
                        </div>
                        <div className="bg-gray-200 p-10 px-24 xl:px-60 flex flex-col-reverse">
                            <div>
                                <FilterForm onFilter={handlefilterChange} />
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    className="btn-edit border border-gray-400 p-2 rounded"
                                    onClick={() => handleViewChange('grid')}
                                >
                                    Grid
                                </button>
                                <button 
                                    className="btn-edit border border-gray-400 p-2 rounded"
                                    onClick={() => handleViewChange('list')}    
                                >
                                    List
                                </button>
                            </div>
                        </div>
                        { !propiedades.length 
                            ? <h1 className="text-center my-24">No hay resultados</h1> 
                            : 
                            <div >
                               

                            { viewState === 'grid' &&
                                
                                <div className="flex justify-center flex-wrap gap-6 p-10 px-20 2xl:px-68">
                                    { propiedades.map(propiedad => (
                                        <div 
                                            key={propiedad.property_id}
                                            onClick={() => handleRowClick(propiedad.property_id)}
                                            className="flex flex-col w-80 gap-2 p-4 border border-gray-200 hover:bg-white rounded-lg cursor-pointer"
                                        >
                                            <div className="w-full h-40 bg-blue-50 flex items-center justify-center hover-zoom"
                                                style={ {backgroundImage: propiedad.images.length > 0 && `url(${propiedad.images[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center' } }
                                            >
                                            </div>
                                            <div className="text-xl ">
                                                {formatToCurrency(propiedad.price)}
                                            </div>
                                            <div className="font-light text-base ">
                                                {propiedad.place_name}
                                            </div>
                                            <div className="flex flex-row gap-10">
                                                <div className="flex gap-1 items-center">
                                                    <IoBed />{propiedad.beds} 
                                                </div>
                                                <div className="flex gap-1 items-center">
                                                    <LiaToiletSolid />{propiedad.baths}
                                                </div>
                                                <div className="flex gap-1 items-center">
                                                    < TfiRulerAlt2 />{propiedad.sqft + 'm²'} 
                                                </div>
                                            </div>
                                            <div className="description truncate">
                                                {propiedad.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            
                            }

                            { viewState === 'list' &&
                            <div className="mb-10">
                                <div className={`tableWrapper mt-4 ${orderLoading ? 'opacity-80 pointer-events-none' : ''}`}>
                                    <table border={1} className="my-table2">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th onClick={() => handleSortChange('property_type')}>
                                                <div>Tipo {renderSortIcon('property_type')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('price')}>
                                                <div>Precio {renderSortIcon('price')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('place_name')}>
                                                <div>Dirección {renderSortIcon('place_name')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('region')}>
                                                <div>Región {renderSortIcon('region')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('beds')}>
                                                <div>Dormitorios {renderSortIcon('beds')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('baths')}>
                                                <div>Baños {renderSortIcon('baths')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('sqft')}>
                                                <div>Superficie {renderSortIcon('sqft')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('availability')}>
                                                <div>Disponibilidad {renderSortIcon('availability')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('list_date')}>
                                                <div>Fecha Alta {renderSortIcon('list_date')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('update')}>
                                                <div>Actualización {renderSortIcon('update')}</div>
                                            </th>
                                            <th onClick={() => handleSortChange('description')}>
                                                <div>Descripción {renderSortIcon('description')}</div>
                                            </th>
                                            
                                        </tr>
                                        </thead>
                                        <tbody>
                                        { propiedades.map(propiedad => (
                                            <tr 
                                                key={propiedad.property_id}
                                                onClick={() => handleRowClick(propiedad.property_id)}
                                            >
                                                <td className="p-2 "> 
                                                    { propiedad.images.length > 0 ? 
                                                        <img
                                                            className="w-20 h-auto min-w-full min-h-full" 
                                                            src={propiedad.images[0].image} 
                                                            alt="property" />
                                                    :
                                                        <img 
                                                            className="w-20 h-auto min-w-full min-h-full" 
                                                            src="https://via.placeholder.com/70" 
                                                            alt="placeholder" /> 
                                                    }     
                                                </td>
                                                <td> {capitalize(propiedad.property_type)} </td>
                                                <td> {formatToCurrency(propiedad.price)} </td>
                                                <td className="truncated-text"> {propiedad.place_name || "Sin definir"} </td>
                                                
                                                <td>{propiedad.region}</td>

                                                <td> {propiedad.beds} </td>
                                                <td> {propiedad.baths} </td>
                                                <td> {propiedad.sqft + " m²"} </td>
                                                <td> {capitalize(propiedad.availability)} </td>
                                                <td> {formatDateString(propiedad.list_date)} </td>
                                                <td> {formatDateString(propiedad.update)} </td>
                                                <td className="truncated-text"> {limitLines(propiedad.description)} </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table> 
                                    
                                </div>
                                { propertyCount > 10 &&
                                    <div className="pagination mt-6 flex justify-center items-center mb-20">
                                        <button
                                            onClick={() => handlePageChange(prevPage)}
                                            disabled={!prevPage}
                                            className="btn-edit border border-gray-400 p-2 rounded hover:bg-white"
                                        >
                                            Anterior
                                        </button>
                                        <span className="mx-2">{currentPage} de {totalPages}</span>
                                        <button
                                            onClick={() => handlePageChange(nextPage)}
                                            disabled={!nextPage}
                                            className="btn-edit ml-2 border border-gray-400 p-2 rounded hover:bg-white"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                }
                                
                            </div>}

                            
                            </div>
                        }
                    </>
                )}
                </>
            )}
        </>
    )
}