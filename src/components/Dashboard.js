import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import axios from 'axios'

function Dashboard(props){
    const[hostedEvents, setHostedEvents] = useState([])
    const[joinedEvents, setJoinedEvents] = useState([])
    const[eventsHosted, setEventsHosted] = useState([])
    const[eventsjoined, setEventsJoined] = useState([])

    const[state, setState] = useState({
        user_id: 24
    })

    useEffect(() => {
        const fetchData = async () => {

        await axios.get('http://localhost:8080/api/get_user_events', {
            params:{
                user_id: state.user_id
            }
        })
        .then((response) => {
            setHostedEvents(response.data.hosted);
            setJoinedEvents(response.data.joined);
        })
        .catch((err) => {
            console.log(err);
        }) 
        console.log(hostedEvents)
        console.log(joinedEvents)
        

        const tempHostedEvents= [];
        const hostedEventsResults = hostedEvents.map((item) => {
            return axios.get('http://localhost:8080/api/get_event', {
                params:{
                    user_id: state.user_id,
                    event_id: item
                }
            })
        })
        Promise.all(hostedEventsResults).then(data => {
            data.map((item) =>{
                tempHostedEvents.push(item.data)
            })

            setEventsHosted(tempHostedEvents)
        })
        console.log("hosted events:")
        console.log(eventsHosted)


        const tempJoinedEvents= [];
        const joinedEventsResults = joinedEvents.map((item) => {
            return axios.get('http://localhost:8080/api/get_event', {
                params:{
                    user_id: state.user_id,
                    event_id: item
                }
            })
        })
        
        Promise.all(joinedEventsResults).then(data => {
            data.map((item) =>{
                tempJoinedEvents.push(item.data)
            })

            setEventsJoined(tempJoinedEvents)
        })
        console.log("joined events:")
        console.log(eventsjoined)
        
    };

        fetchData();

    }, [hostedEvents, joinedEvents])

    return (
        <div>
            <Header/>
            <br/>
            <div className="card">
                <div className="card-body">
                    {eventsHosted && eventsHosted.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item" key={item.id}>
                                <Link to={{pathname: '/event',
                                    dashboardProps: {
                                    event_id: item.id,
                                    user_id: state.user_id
                                }}}>
                                    {item.name}
                                </Link>
                            </li>
                        </ul>
                        ))}


                    {eventsjoined && eventsjoined.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item" key={item.id}>
                                <Link to={{pathname: '/event',
                                    dashboardProps: {
                                    event_id: item.id
                                }}}>
                                    {item.name}
                                </Link>
                            </li>
                        </ul>
                        ))}

                    <div/>
                </div>
                </div>
            <Link to="/" style={{ textDecoration: "none" }}>
                <button color="link" className="registerButton"> Logout </button>
            </Link>
            <br/>
            <br/>
            <Link to="/createEvent" style={{ textDecoration: "none" }}>
                <button color="link" className="registerButton">Create New Event</button>
            </Link>
         </div>
    )
}

export default Dashboard;