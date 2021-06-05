import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import { useHistory , Link, useParams} from "react-router-dom";
import axios from 'axios';
import {Alert, Button, Container, Row, Col, Image, ListGroup} from 'react-bootstrap';
import defaultImage from './assets/blank-profile-no-tag.png'


function Event(props){
    const componentParams = useParams();

    const[state, setState] = useState({
        event_id: componentParams.eventId,
        user_id: componentParams.userId
    })

    let history = useHistory();
    const redirect = () => {
        history.push({
          pathname:  '/editEvent/' + state.user_id + "/" + state.event_id
        })
    }
    
    const[joinedMessage, setJoinedMessage] = useState('');
    const[alert1, setAlert1] = useState(false);
    const[alert2, setAlert2] = useState(false);

    const[eventState, setEventState] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        event_type: "",
        remainining_spots: 0,
        scope: "",
        attendees: [],
        participation_type: ""
    })
    const[showJoin, setShowJoin] = useState(false)
    const[showEdit, setShowEdit] = useState(false)
    const noResults = "No user has joined this event yet!";

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
            {if(response.data.host.id != state.user_id && response.data.remainining_spots>0 && !response.data.attendees.some(item => item.id == state.user_id)){
                setShowJoin(true)
            }}

            if(response.data.host.id == state.user_id){
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
                attendees: response.data.attendees,
                participation_type: response.data.participation_type
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
                setShowJoin(false);
                setAlert1(true);
                setTimeout(() => { setAlert1(false);}, 3000);
                
            }
        })
    }

    async function handleLeave(){
        await axios.put('http://localhost:8080/api/leave_event', {
            },
            {
            params: {
                user_id: state.user_id,
                event_id: state.event_id
            }
        })
        .then((response) => {
            if(response.status === 200){
                setShowJoin(true);
                setAlert2(true);
                setTimeout(() => { setAlert2(false);}, 3000);
                
            }
        })

    }

        return (
            <div>
            <Header user_id= {state.user_id}/>
            <br/>
            {joinedMessage && <div className="registeredMessage"> {joinedMessage} </div>}
            <Alert className="alert-body" show={alert1} variant="success">
                <Alert.Heading>You have joined this event.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert1(false)} variant="success">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert2} variant="danger">
                <Alert.Heading>You have now left this event.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert2(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>
            <Container fluid>
                <div className="name-div">
                    <h1>{eventState.name}</h1>
                </div>
                
                <Row>
                    <Col sm>
                        <div className="name-div">
                            <br />
                            <h2>Description</h2>
                            <div className="experiment-body-event-upper">
                                {eventState.description}
                            </div>
                            
                            <h2>Event Details</h2>
                            <div className="experiment-body-event-lower">
                                <Row> 
                                    <Col sm={6}>
                                        Location:
                                    </Col>   
                                    <Col sm={4} style={{color:'white'}}>
                                        {eventState.location}
                                    </Col>
                                </Row>
                                <br />
                                <Row> 
                                    <Col sm={6}>
                                        Event Type:
                                    </Col>   
                                    <Col sm={4} style={{color:'white'}}>
                                        {eventState.event_type}
                                    </Col>
                                </Row>
                                <br />
                                <Row> 
                                    <Col sm={6}>
                                        Date/Time:
                                    </Col>   
                                    <Col sm={4} style={{color:'white'}}>
                                        {eventState.date}
                                    </Col>
                                </Row>
                                <br />
                                <Row> 
                                    <Col sm={6}>
                                        Remaining Spots:
                                    </Col>   
                                    <Col sm={4} style={{color:'white'}}>
                                        {eventState.remainining_spots}
                                    </Col>
                                </Row>
                                <br/>
                                <div className="event-visibility" style={{color:'white'}}>
                
                                    <b>This is a {eventState.scope} event.</b>
                                </div>
                                <br/>
                            </div>
                        </div>
                    </Col>
                    
                    <Col sm>
                        <div className="name-div">
                            <br />
                            <h2>Attendees</h2>
                            <div className="experiment-body-event-attendees">
                                {eventState.attendees.length===0 && <div className="registeredMessage"> {noResults} </div>}
                                {eventState.attendees.map((item) => 
                                    (
                                        <ListGroup>
                                            {
                                            <li class="modified-list-attendees d-flex" key={item.id} >

                                            {item.image=== null &&
                                                    <Image className={"event-image"} src={defaultImage} roundedCircle/>
                                                }
                                                {item.image!== null &&
                                                    <Image className={"event-image"} src={item.image} roundedCircle/>
                                                }

                                            <Link  to={{pathname: '/userProfile/' + state.user_id + "/" + item.id + "/" + false  }} className="custom-color-attendees" style={{ textDecoration: "none" }}>
                                                    {item.name}
                                            </Link>
                                            </li>
}
                                        </ListGroup>
                                    ))}
                            </div>
                        </div>
                    </Col>
                </Row>
                
            <br/>
            {showJoin && <Button variant="success" size="lg" onClick={handleJoin} className="joinEventButton"> Join Event </Button>}
            {!showJoin && eventState.participation_type=="attendee" &&  <Button variant="danger" size="lg" onClick={handleLeave} className="joinEventButton"> Leave Event </Button>}
            {showEdit && <Button  variant="warning" size="lg" onClick={redirect} className="editEventButton"> Edit Event </Button>}    
            <br/>
            <br/>
            
            </Container>
            </div>
        )
}

export default Event;