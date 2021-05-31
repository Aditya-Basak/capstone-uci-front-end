import React, {useEffect, useState} from 'react'
import Header from './RegisterHeader'
import moment from 'moment'
import axios from 'axios'
import { useHistory , useParams} from "react-router-dom";
import {Button, Container, Row, Col, Form} from 'react-bootstrap';

function EditEvent(props){
    const componentParams = useParams();

    let history = useHistory();
    
    const[state, setState] = useState({
        name: "",
        event_type: "",
        description: "",
        location: "",
        time: 0,
        date_field: "",
        time_field: "",
        limit: "",
        scope: "",
    })
     
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_event",{
            params: {
                user_id: componentParams.userId,
                event_id: componentParams.eventId
            }
        });

        var date = new Date(result.data.time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(month < 10)
        {
            if(day < 10)
                var d_field = year  + "-0" + month + "-0" + day;
            else
            var d_field = year  + "-0" + month + "-" + day;
        }
        else
        {
            if(day < 10)
                var d_field = year  + "-" + month + "-0" + day;
            else
                var d_field = year  + "-" + month + "-" + day;
        }

        if(hours < 10)
        {
            if(minutes < 10)
                var t_field = "0"+hours  + ":0" + minutes;
            else
                var t_field = "0"+hours  + ":" + minutes;
        }
        else
        {
            if(minutes < 10)
                var t_field = hours  + ":0" + minutes;
            else
                var t_field = hours + ":" + minutes;
        }
        
        
        setState({name: result.data.name,
                event_type: result.data.event_type,
                description: result.data.description,
                location: result.data.location,
                limit: result.data.limit,
                date_field: d_field,
                time_field: t_field,
                scope:result.data.scope});
    },[]);

    const[editedMessage, setEditedMessage] = useState('');

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
      //  console.log(event.target.value); 
    }

    async function handleSubmit (event){
       // event.preventDefault();
        
        console.log(state.name);
        console.log(state.event_type);
        console.log(state.description);
        console.log(state.location);
        console.log(state.date_field+"T"+state.time_field)
        console.log(new Date(state.date_field+"T"+state.time_field).getTime());
        console.log(state.limit);
        console.log(state.scope);
        
        if(state.name == "" || 
            state.event_type == "" ||
            state.description == "" ||
            state.location == "" ||
            state.date_field == "" ||
            state.time == "" ||
            state.limit == "" ||
            state.scope == "" )
                alert("All the fields are REQUIRED.");
        
        else{
            await axios.put('http://localhost:8080/api/edit_event', {
                name: state.name,
                event_type: state.event_type,
                description: state.description,
                location: state.location,
                time: new Date(state.date_field+"T"+state.time_field).getTime(),
                limit: parseInt(state.limit),
                scope: state.scope
            },
            {
                params:{
                    user_id: componentParams.userId,
                    event_id: componentParams.eventId
                }
            })
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    setEditedMessage("Event has been edited!");
                    alert("Event successfully modified.");
                    history.push({
                        pathname:  '/event/' + componentParams.userId + "/" + componentParams.eventId
                    })
                }
            })
            .catch(error => {
                alert("Something went wrong. Retry modifying.\n"+error);
                window.location = "/editEvent";
            });
        }
    }
    return (
        
        <div>
            <Header user_id= {componentParams.userId}/>
            <Container fluid>
                    <br/><br/><br/>
            <div class="experiment-body">
                    <h2>
                        Edit event details:
                    </h2>
                    <br />
            <Form>
                {editedMessage && <div className="editedMessage"> {editedMessage} </div>}
                <Form.Group as={Row} controlId="formHorizontalName">
                <Form.Label column sm={2}>Event Name:</Form.Label>
                    <Col sm={6}>    
                    <Form.Control size="lg"  input id="name"  placeholder="Enter new event name." value={state.name} onChange={handleChange} required />
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
                            <Form.Control as="textarea" size="lg" id="description" placeholder="A short description of your event." value={state.description} onChange={handleChange} />
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
                <br />

                 <fieldset>
                    <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label as="legend" column sm={2}>Scope:</Form.Label>
                        <Col sm={3}>
                            <Form.Check id = "scope" type = "radio" name="secrecy" label="Public"  value="public" checked={state.scope ===  "public"} onChange={handleChange}/>
                        </Col>
                        <Col sm={3}>
                            <Form.Check id = "scope" type = "radio" name="secrecy" label="Private" value="private" checked={state.scope ===  "private"} onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                </fieldset>
            </Form>
            </div>
            <Button variant="success"  size='lg' onClick={handleSubmit} className="registerButton"> Modify </Button>
            
        </Container>
         </div>

    )
}

export default EditEvent 