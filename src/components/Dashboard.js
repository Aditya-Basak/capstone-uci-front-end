import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import axios from 'axios'

function Dashboard(props){
    const[hostedEvents, setHostedEvents] = useState([])
    const[joinedEvents, setJoinedEvents] = useState([])

    useEffect(() => {
        const fetchData = async () => {

        await axios.get('http://localhost:8080/api/get_user_events', {
            params:{
                user_id: props.location.user_id
            }
        })
        .then((response) => {
            setHostedEvents(response.data.upcomingEvents.hosted);
            setJoinedEvents(response.data.upcomingEvents.joined);
        })
        .catch((err) => {
            console.log(err);
        }) 
    };
        fetchData();

    }, [])

    return (
        <div>
            <Header/>
            <br/>
            <div className="card">
                <div className="card-body">
                    {hostedEvents && hostedEvents.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item" key={item.id}>
                                <Link to={{pathname: '/event',
                                    componentProps: {
                                    event_id: item.id,
                                    user_id: props.location.user_id
                                }}}>
                                    {item.name}
                                </Link>
                            </li>
                        </ul>
                        ))}

                    {joinedEvents && joinedEvents.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item" key={item.id}>
                                <Link to={{pathname: '/event',
                                    componentProps: {
                                    event_id: item.id,
                                    user_id: props.location.user_id
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
            <Link to={{pathname: '/createEvent',
                                    componentProps: {
                                    user_id: props.location.user_id
                                }}} style={{ textDecoration: "none" }}>
                <button color="link" className="registerButton">Create New Event</button>
            </Link>
         </div>
    )
}

export default Dashboard;