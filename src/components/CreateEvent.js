import React, {useState} from 'react'
import Header from './RegisterHeader'
import moment from 'moment'
import axios from 'axios'
import { useHistory , useParams} from "react-router-dom";
import {Button, Container, Row, Col, Form, Alert} from 'react-bootstrap';

function CreateEvent(props){
    const componentParams = useParams();
    let history = useHistory();

    const[state, setState] = useState({
        name: "",
        event_type: "",
        description: "",
        location: "",
        date_field: "",
        time_field: "",
        limit: "",
        scope: "",
    })

    const[createdMessage, setCreatedMessage] = useState('');
    const[alert1, setAlert1] = useState(false);
    const[alert2, setAlert2] = useState(false);
    const[alert3, setAlert3] = useState(false);
    

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
      //  console.log(event.target.value); 
    }

    async function handleSubmit (event){
       // event.preventDefault();
        
        
        if(state.name == "" || 
            state.event_type == "" ||
            state.description == "" ||
            state.location == "" ||
            state.date_field == "" ||
            state.time == "" ||
            state.limit == "" ||
            state.scope == "" )
                setAlert1(true);
        
        else{
            await axios.post('http://localhost:8080/api/create_event', {
                name: state.name,
                event_type: state.event_type,
                description: state.description,
                location: state.location,
                time: new Date(state.date_field+"T"+state.time_field).getTime(),
                limit: parseInt(state.limit),
                scope: state.scope
            },
            {
                params: {user_id: componentParams.userId}, 
            })
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    setCreatedMessage("Event has been created!");
                    setAlert3(true);
                    
                }
            })
            .catch(error => {
                setAlert2(true);
            });
        }
    }

    return (
        
            <div>
                <Header user_id= {componentParams.userId}/>
                <Container fluid>
                
                <Alert className="alert-body" show={alert1} variant="danger">
                    <Alert.Heading>None of the fields can be empty.</Alert.Heading>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => setAlert1(false)} variant="danger">
                            Close
                        </Button>
                    </div>
                </Alert>

                <Alert className="alert-body" show={alert2} variant="danger">
                    <Alert.Heading>Something went wrong. Retry creating.</Alert.Heading>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => {setAlert2(false); window.location = "/createEvent/"+componentParams.userId;}} variant="danger">
                            Close
                        </Button>
                    </div>
                </Alert>

                <Alert className="alert-body" show={alert3} variant="success">
                    <Alert.Heading>Event successfully created.</Alert.Heading>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => {setAlert3(false); window.location = "/dashboard/"+componentParams.userId;}} variant="success">
                            Close
                        </Button>
                    </div>
                </Alert>

                    <br/><br/><br/>
                <div class="experiment-body">
                    <h2>
                        Enter event details:
                    </h2>
                    <br />
                <Form>
                    {createdMessage && <div className="createdMessage"> {createdMessage} </div>}
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>Event Name:</Form.Label>
                        <Col sm={6}>
                            <Form.Control size="lg"  input id="name"  placeholder="Tell us what your event will be called." value={state.name} onChange={handleChange} required />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row}    controlId="formHorizontalName">
                    <Form.Label column sm={2}>Event Type:</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="select" size="lg" id="event_type" value={state.event_type} onChange={handleChange}>
                                <option hidden value>Select an Option.</option>
                                
                                <option value="Soccer">Soccer</option>
                                <option value="basketball">Basketball</option>
                                <option value="football">Football</option>
                                <option value="cricket">Cricket</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>Description:</Form.Label>
                        <Col sm={6}>
                            <Form.Control as="textarea" style={{ height: '120px' }} size="lg" id="description" placeholder="A short description of your event." value={state.description} onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>Location:</Form.Label>
                        <Col sm={6}>
                            <Form.Control size="lg" input id="location"  placeholder="Where are you planning to host it?" value={state.location} onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>Date:</Form.Label>
                        <Col sm={2}>
                            <Form.Control size="lg" input id="date_field"  type= "date" min={moment().format("YYYY-MM-DD")} value={state.date_field} onChange={handleChange} />
                        </Col>
                        <Form.Label column sm={2}>Time:</Form.Label>
                        <Col sm={2}>
                            <Form.Control size="lg" input id="time_field"  type= "time" value={state.time_field} onChange={handleChange} />
                        </Col>
                    </Form.Group>
                   
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>Attendees Limit:</Form.Label>
                        <Col sm={6}>
                        <Form.Control size="lg" id="limit" type="number" placeholder="Number of slots your event has." min="1" value={state.limit} onChange={handleChange} />
                        </Col>
                    </Form.Group>
                   
                    <fieldset>
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label as="legend" column sm={2}>Scope:</Form.Label>
                        <Col sm={3}>
                            <Form.Check id = "scope" type = "radio" name="secrecy" label="Public" value="public" onChange={handleChange}/>
                        </Col>
                        <Col sm={3}>
                            <Form.Check id = "scope" type = "radio" name="secrecy" label="Private" value="private" onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    </fieldset>
                </Form>
                </div>
                <Button variant="success"  size='lg' onClick={handleSubmit} className="registerButton"> Create </Button>
                
         </Container>
         </div>
    )
}

export default CreateEvent 