import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { PinDropSharp } from '@material-ui/icons';
import {Button, Form} from 'react-bootstrap';
import {Nav} from 'react-bootstrap'

function Dashboard(props){
    const[upcomingHostedEvents, setUpcomingHostedEvents] = useState([])
    const[upcomingJoinedEvents, setUpcomingJoinedEvents] = useState([])
    const[pastHostedEvents, setPastHostedEvents] = useState([])
    const[pastJoinedEvents, setPastJoinedEvents] = useState([])
    const[showUpcoming, setShowUpcoming] = useState(false);
    const[showPast, setShowPast] = useState(true);
    const[searchState, setSearchState] = useState({
        event_name: "",
        location: "",
    })

    useEffect(() => {
        const fetchData = async () => {
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

    let history = useHistory();
    const redirect = () => {
        history.push({
          pathname:  '/search',
          user_id: props.location.user_id,
          event_name: searchState.event_name,
          location: searchState.location
        })
    }

    function handlePastSelect () {
        setShowPast(true);
        setShowUpcoming(false);
    }

    function handleUpcomingSelect () {
        setShowPast(false);
        setShowUpcoming(true);
    }
    
    function handleChange (event) {
        setSearchState({
            ...searchState,
            [event.target.id]: event.target.value
        }); 
    }

    return (
        <div>
            <Header user_id= {props.location.user_id}/>
            <br/>
            <br/>

            <Form>
            <div class="form-row">
            <div class="col">
                <input type="text" class="form-control" id="event_name"  placeholder="Event keyword(s)" value={searchState.event_type} onChange={handleChange} ></input>
            </div>
            <div class="col">
                <input type="text" class="form-control" id="location"  placeholder="Location" value={searchState.location} onChange={handleChange}></input>
            </div>
            <Button variant="success"  size='sm' id="myBtn" onClick={redirect} className="registerButton"> Search </Button>
            </div>
            </Form>

            <br/>
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