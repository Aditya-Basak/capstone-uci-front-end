import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import axios from 'axios'
import { useHistory , useParams} from "react-router-dom";
import { Search } from 'react-bootstrap-icons';
import {Button, Tab, Tabs, Container, Row, Col, Form, ListGroup} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

const override = css`
  margin: auto;
  margin-top: 20%;
`;

function Dashboard(props){
    const componentParams = useParams();
    
    const[upcomingHostedEvents, setUpcomingHostedEvents] = useState([])
    const[upcomingJoinedEvents, setUpcomingJoinedEvents] = useState([])
    const[pastHostedEvents, setPastHostedEvents] = useState([])
    const[pastJoinedEvents, setPastJoinedEvents] = useState([])
    const[showUpcoming, setShowUpcoming] = useState(true);
    const[showPast, setShowPast] = useState(false);
    const noResults1 = "No upcoming events to show.";
    const noResults2 = "No past events to show.";
    const[searchState, setSearchState] = useState({
        event_name: "",
        location: "",
    })
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        await axios.get('http://localhost:8080/api/get_user_events', {
            params:{
                user_id: componentParams.userId
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
        setLoading(false); 
    };
        fetchData();

    }, [])

    let history = useHistory();
    const redirect = () => {
        history.push({
          pathname:  '/search' + "/" + componentParams.userId +"/"+ searchState.event_name + "/" + searchState.location
        })
    }

    function handleSelect() {
        if(showPast)
        {
            setShowPast(false);
            setShowUpcoming(true);
        }
        else
        {
            setShowPast(true);
            setShowUpcoming(false);
        }
    }
    
    function handleChange (event) {
        setSearchState({
            ...searchState,
            [event.target.id]: event.target.value
        }); 
    }

    
    if(loading){
        return(
         <div className="sweet-loading">
         <Header user_id= {componentParams.userId}/>
         <ClipLoader color={"aqua"} loading={loading} css={override} size={110} />
         </div>
        )
    }
    
    return (
        <div>
            <Header user_id= {componentParams.userId}/>
            <br/>
            
            <div className="dashboard">
                <h1>What event interests you today?</h1>
                
            </div>
            <br/>
            <Container fluid>
            <div className="dashboard-form">
            <Form>
            <Form.Group as={Row}>
            <Col sm={5}>
                <Form.Control size="md" id="event_name"  placeholder="Event Keyword(s)" value={searchState.event_name} onChange={handleChange} ></Form.Control>
            </Col>
            <Col sm={5}>
                <Form.Control size="md" id="location"  placeholder="Location" value={searchState.location} onChange={handleChange}></Form.Control>
            </Col>
            <Col sm={1}>
            <Search className="search-icon" color="white" size={30} onClick={redirect}/>
            </Col>
            </Form.Group>
            </Form>
            <br/>
            </div>
            </Container>
            <div className="dashboard-tab">
            <Tabs  className="custom-tabs" defaultActiveKey="upcoming" onSelect={handleSelect}>
                <Tab eventKey="upcoming" title="Upcoming Events">
                    
                </Tab>

                <Tab eventKey="past" title="Past Events">

                    
                </Tab>
                
            </Tabs>
            </div>
            {showUpcoming &&
            <div className="experiment-body-dashboard">
                <div >
                {upcomingHostedEvents.length===0 && upcomingHostedEvents.length===0  && <div className="registeredMessage"> {noResults1} </div>}
                    {upcomingHostedEvents && upcomingHostedEvents.map((item) => (
                        <ListGroup>
                            <li className="modified-list2 d-flex justify-content-between align-items-center" key={item.id} >
                                <Link  to={{pathname: '/event/' + componentParams.userId + "/" + item.id }} className="custom-color">
                                    {item.name}
                                </Link>
                                <span className="badge badge-info badge-pill">Hosting</span>
                            </li>
                        </ListGroup>
                        ))}

                    {upcomingJoinedEvents && upcomingJoinedEvents.map((item) => (
                        <ListGroup>
                            <li className="modified-list2 d-flex justify-content-between align-items-center" key={item.id} >
                                <Link to={{pathname: '/event/' + componentParams.userId + "/" + item.id }} className="custom-color">
                                    {item.name}
                                </Link>
                                <span class="badge badge-info badge-pill">Attending</span>
                            </li>
                        </ListGroup>
                        ))}

                    <div/>
                </div>
                </div>
                }
            {showPast &&
            <div className="experiment-body-dashboard">
            <div>
                
                {pastHostedEvents.length===0 && pastHostedEvents.length===0  && <div className="registeredMessage"> {noResults2} </div>}

                {pastHostedEvents && pastHostedEvents.map((item) => (
                    <ListGroup>
                        <li className="modified-list2 d-flex justify-content-between align-items-center" key={item.id} >
                            <Link to={{pathname: '/pastEvent/' + componentParams.userId + "/" + item.id 
                                }} className="custom-color">
                                {item.name}
                            </Link>
                            <span class="badge badge-secondary badge-pill">Hosted</span>
                        </li>
                    </ListGroup>
                    ))}

                {pastJoinedEvents && pastJoinedEvents.map((item) => (
                    <ListGroup>
                        <li className="modified-list2 d-flex justify-content-between align-items-center" key={item.id} >
                            <Link to={{pathname: '/pastEvent/' + componentParams.userId + "/" + item.id }} className="custom-color">
                                {item.name}
                            </Link>
                            <span class="badge badge-secondary badge-pill">Attended</span>
                        </li>
                    </ListGroup>
                    ))}
                <div/>
            </div>
            </div>
            }
            <br/>
            <Link to={{pathname: '/createEvent/' + componentParams.userId}} style={{ textDecoration: "none" }}>
                <Button variant="custom-dashboard" size="lg">Create New Event</Button>
            </Link>
            
         </div>
    )
}

export default Dashboard;