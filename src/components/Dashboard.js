import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import axios from 'axios'
import { PinDropSharp } from '@material-ui/icons';
import {Nav} from 'react-bootstrap'

function Dashboard(props){
    const[upcomingHostedEvents, setUpcomingHostedEvents] = useState([])
    const[upcomingJoinedEvents, setUpcomingJoinedEvents] = useState([])
    const[pastHostedEvents, setPastHostedEvents] = useState([])
    const[pastJoinedEvents, setPastJoinedEvents] = useState([])
    const[showUpcoming, setShowUpcoming] = useState(false);
    const[showPast, setShowPast] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        var x = props.location.user_id
        await axios.get('http://localhost:8080/api/get_user_events', {
            params:{
                user_id: props.location.user_id
            }
        })
        .then((response) => {
            setUpcomingHostedEvents(response.data.upcomingEvents.hosted);
            setUpcomingJoinedEvents(response.data.upcomingEvents.joined);
            setPastHostedEvents(response.data.pastEvents.hosted);
            setPastJoinedEvents(response.data.pastEvents.joined);
        })
        .catch((err) => {
            console.log(err);
        }) 
    };
        fetchData();

    }, [])

    function handlePastSelect () {
        setShowPast(true);
        setShowUpcoming(false);
    }

    function handleUpcomingSelect () {
        setShowPast(false);
        setShowUpcoming(true);
    }

    return (
        <div>
            <Header user_id= {props.location.user_id}/>
            <br/>
            <Nav variant="pills" defaultActiveKey="link-2">
                <Nav.Item>
                <Nav.Link eventKey="link-1" > Events Near You</Nav.Link>
                
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="link-2" onSelect={handlePastSelect}>Past Events</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                <Nav.Link eventKey="link-3" onSelect={handleUpcomingSelect}>Upcoming Events</Nav.Link>
                </Nav.Item>
            </Nav>
            {showUpcoming &&
            <div className="card">
                <div className="card-body">
                    {upcomingHostedEvents && upcomingHostedEvents.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
                                <Link to={{pathname: '/event',
                                    componentProps: {
                                    event_id: item.id,
                                    user_id: props.location.user_id
                                }}}>
                                    {item.name}
                                </Link>
                                <span class="badge badge-primary badge-pill">Hosting</span>
                            </li>
                        </ul>
                        ))}

                    {upcomingJoinedEvents && upcomingJoinedEvents.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
                                <Link to={{pathname: '/event',
                                    componentProps: {
                                    event_id: item.id,
                                    user_id: props.location.user_id
                                }}}>
                                    {item.name}
                                </Link>
                                <span class="badge badge-primary badge-pill">Attending</span>
                            </li>
                        </ul>
                        ))}

                    <div/>
                </div>
                </div>
                }

            {showPast &&
            <div className="card">
            <div className="card-body">
                {pastHostedEvents && pastHostedEvents.map((item) => (
                    <ul className="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
                            <Link to={{pathname: '/pastEvent',
                                componentProps: {
                                event_id: item.id,
                                user_id: props.location.user_id
                            }}}>
                                {item.name}
                            </Link>
                            <span class="badge badge-primary badge-pill">Hosted</span>
                        </li>
                    </ul>
                    ))}

                {pastJoinedEvents && pastJoinedEvents.map((item) => (
                    <ul className="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
                            <Link to={{pathname: '/pastEvent',
                                componentProps: {
                                event_id: item.id,
                                user_id: props.location.user_id
                            }}}>
                                {item.name}
                            </Link>
                            <span class="badge badge-primary badge-pill">Attended</span>
                        </li>
                    </ul>
                    ))}
                <div/>
            </div>
            </div>
            }
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