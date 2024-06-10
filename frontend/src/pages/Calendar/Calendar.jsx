import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import Spinner from "../../components/Spinner";
import api from "../../utils/api";
import { Tooltip } from 'react-tooltip';
import { capitalize } from "../../utils/property_utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Calendar = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agentsColors, setAgentsColors] = useState({})
    const [agentNames, setAgentNames] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        const getVisits = async () => {
            try {
                const res = await api.get('/visits/');
                console.log(res.data)
                const agents = res.data.map(visit => ({id: visit.agent_id, name: visit.agent_name}));
                const uniqueAgents = Array.from(new Set(agents.map(agent => agent.id))).map(id => agents.find(agent => agent.id === id));
                const agentIds = uniqueAgents.map(agent => agent.id);
                const colors = generateColors(agentIds);
                const agentNamesMap = {};
                uniqueAgents.forEach(agent => {
                    agentNamesMap[agent.id] = agent.name;
                })
                const events = res.data.map(visit => ({
                    id: visit.visit_id,
                    title: visit.client_iden,
                    start: visit.start,
                    extendedProps:{
                        propertyAddress: visit.property_address,
                        propertyId: visit.property_id,
                        agentId: visit.agent_id,
                        visit_state: visit.visit_state,
                    }
                }));
                console.log(events)
                setAgentsColors(colors);
                setAgentNames(agentNamesMap);
                setEvents(events);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        getVisits();
    }, [])

    const generateColors = (agentsIds) => {
        const colors = {};
        agentsIds.forEach(id => {
            colors[id] = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        })
        return colors;
    }

    

    const renderedEventContent = (eventInfo) => {
        const isMonthView = eventInfo.view.type === 'dayGridMonth';
        const isWeekView = eventInfo.view.type === 'timeGridWeek';
        const anchorId = `event-anchor-${eventInfo.event.id}`
        const agentColor = agentsColors[eventInfo.event.extendedProps.agentId];
        console.log(agentColor,'agentColor')
        return (
            <>
                <div
                    id={anchorId}
                    className="event-anchor"
                    style={{
                        display: 'flex',
                        alignItems: isWeekView ? 'start' : 'center',
                        justifyContent: isMonthView || isWeekView ? 'start' : 'center',
                        whiteSpace: isMonthView ? 'nowrap' : 'normal',
                        overflow:'hidden',
                        textOverflow: 'ellipsis',
                    }}

                >
                    <div
                        style={{
                            backgroundColor: agentColor,
                            width: '10px',
                            height: '10px',
                            display: 'inline-block',
                            marginRight: '0.5rem',
                            borderRadius: '50%',
                            marginTop: isWeekView && '1rem',
                            marginLeft: '0.2rem'
                        }}
                    >&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    {eventInfo.event.title}
                </div>
                
                <Tooltip 
                    anchorSelect={`#${anchorId}`} 
                    positionStrategy="fixed"
                    place="top" 
                    clickable
                    border={`1px solid ${agentColor}`}
                    style={{
                        backgroundColor: 'white', 
                        color: 'black', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.9rem',
                        
                    }}
                >
                    <div className="p-1">
                        {eventInfo.event.extendedProps.visit_state === 'cancelada' && <span className="p-1 text-md text-red-700">✗</span>}
                        {eventInfo.event.extendedProps.visit_state === 'realizada' && <span className="p-1 text-lg text-green-700">✓</span>}
                        {eventInfo.event.title}
                    </div>
                    <div className="p-1 bg-white flex justify-center hover:cursor-pointer"
                        onClick={() => {
                            navigate(`/properties/${eventInfo.event.extendedProps.propertyId}`)
                        }}
                    >
                        {eventInfo.event.extendedProps.propertyAddress}
                    </div>
                </Tooltip>
                {!isMonthView &&
                    <div className="flex justify-center">{eventInfo.event.extendedProps.propertyAddress}</div>
                }
            </>
        )
    }

    return (
        <>

            {loading ? <Spinner /> : (
                <>
                    <div className="flex mt-10 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-end">
                        <button 
                            className="btn-edit -mb-10 border border-gray-400 rounded p-2 bg-white hover:shadow"
                            onClick={() => {
                                navigate('/visits')
                            }}
                        >
                            Ver todas las visitas
                        </button>
                    </div>
                    <div 
                        className="bg-white shadow-md rounded px-10 pt-8 pb-8 mb-4 "
                        style={{width: "80%", margin: "5rem auto"}}
                    >
                        

                    <FullCalendar
                        locale={'es'}
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        contentHeight={"auto"}
                        events={events}
                        eventContent={renderedEventContent}
                    />
                    <div className="p-5 flex justify-center">
                            <ul className="flex flex-row gap-5">
                                {Object.entries(agentsColors).map(([agentId, color]) => (
                                    <li key={agentId}>
                                        <div 
                                            style={{
                                                background: color,
                                                width: '1rem',
                                                height: '1rem',
                                                display: 'inline-block',
                                                marginRight: '0.5rem',
                                                borderRadius: '50%',
                                            }}
                                        ></div>
                                        {capitalize(agentNames[agentId])}
                                    </li>
                                ))}
                            </ul>
                        </div>
                </div>
                
            </>
            )}
            
        </>
    )
}

export default Calendar;