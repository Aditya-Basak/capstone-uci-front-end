import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import { useHistory } from "react-router-dom";
import axios from 'axios'


function Event(props){

    const[state, setState] = useState({
        event_id: props.location.componentProps.event_id,
        user_id: props.location.componentProps.user_id
    })

    let history = useHistory();
    const redirect = () => {
        history.push({
          pathname:  '/editEvent',
          event_id: state.event_id,
          user_id: state.user_id
        })
    }

    const backToDashboard = () => {
        history.push({
            pathname:  '/dashboard',
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
        remainining_spots: 0,
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
            const date = new Date(response.data.time);
            let dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date)
            {if(response.data.host.id != state.user_id && response.data.remainining_spots>0 && !response.data.attendees.some(item => item.id === state.user_id)){
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
                remainining_spots: response.data.remainining_spots,
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

    async function handleJoin (event){
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
                    <b>Remaining spots:</b> {eventState.remainining_spots}
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
            <br/>
            {<button onClick={backToDashboard} className="backButton" > Go Back </button>}
            <br/>
            {showJoin && <button onClick={handleJoin} className="joinEventButton"> Join Event </button>}
            <br/>
            {showEdit && <button  onClick={redirect} className="editEventButton"> Edit Event </button>}

            </div>
        )
}

export default Event;