import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import { useHistory } from "react-router-dom";
import axios from 'axios'


function Event(props){

    const[state, setState] = useState({
        event_id: props.location.dashboardProps.event_id,
        user_id: props.location.dashboardProps.user_id
    })

    let history = useHistory();
    const redirect = () => {
        history.push({
          pathname:  '/editEvent',
          event_id: state.event_id,
          user_id: state.user_id
        })
    }
    
    const[joinedMessage, setJoinedMessage] = useState('');

    const[eventState, setEventState] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        event_type: "",
        limit: 0,
        scope: "",
        attendees: []
    })
    const[showJoin, setShowJoin] = useState(false)
    const[showEdit, setShowEdit] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:8080/api/get_event', {
            params:{
                user_id: state.user_id,
                event_id: state.event_id
            }
        })
        .then((response) => {
            console.log(response)
            const date = new Date(response.data.time*1000);
            let dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date)
            {if(response.data.host.id != state.user_id && response.data.limit>0 && !response.data.attendees.some(item => item.id === state.user_id)){
                setShowJoin(true)
            }}

            if(response.data.host.id === state.user_id){
                setShowEdit(true)
            }
            setEventState({
                name: response.data.name,
                description: response.data.description,
                location: response.data.location,
                date: dateFormat,
                event_type: response.data.event_type,
                limit: response.data.limit,
                scope: response.data.scope,
                attendees: response.data.attendees
            })
        })
        .catch((err) => {
            console.log(err);
        }) 
        }

        fetchData();
    }, [showJoin, showEdit]);

    async function handleSubmit (event){
        console.log("joining")
        event.preventDefault();

        await axios.post('http://localhost:8080/api/join_event', {
            },
            {
            params: {
                user_id: state.user_id,
                event_id: state.event_id
            }
        })
        .then((response) => {
            if(response.status === 200){
                setJoinedMessage("You have joined this event!");
                setShowJoin(false)
            }
        })

    }

        return (
            <div>
            <Header/>
            <br/>
            {console.log(state.event_id)}
            {console.log(eventState)}
            {joinedMessage && <div className="registeredMessage"> {joinedMessage} </div>}
            <h2 className="eventTitle" >{eventState.name}</h2>
            <div className="card">
                <div className="card-body">
                    <h3 >Description</h3>
                    {eventState.description}

                </div>
            </div>

            <br/>
            <h4 className="eventTitle">Event Details:</h4>
            <div className="card">
                <div className="card-body">
                    <b>Location:</b> {eventState.location}
                    {<br/>}
                    <b>Date/Time:</b> {eventState.date}
                    <br/>
                    <b>Event Type:</b> {eventState.event_type}
                    {<br/>}
                    <b>Remaining spots:</b> {eventState.limit}
                    {<br/>}
                    {<br/>}
                    <b>Attendees:</b> {eventState.attendees.map((item) => (
                            <li  key={item.id}>
                                
                                    {item.name}
                                
                            </li>))}
                            {<br/>}
                            {<br/>}
                    This is a {eventState.scope} event

                </div>
            </div>
            {showJoin && <button onClick={handleSubmit} className="joinEventButton"> Join Event </button>}
            <br/>
            <br/>
            {showEdit && <button  onClick={redirect} className="editEventButton"> Edit Event </button>}
            </div>
        )

}

export default Event;