import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import { useHistory, useParams } from "react-router-dom";
import axios from 'axios'
import moment from 'moment';
import {Button, Tab, Tabs, Container, Row, Col, Form, ListGroup} from 'react-bootstrap';
import configData from '../config.json'


function Search(props){
    const componentParams = useParams();
    let history = useHistory();

    const[state, setState] = useState({
        event_name: componentParams.eventName,
        location: componentParams.location,
        event_type: componentParams.eventType,
        date: componentParams.date
    })

    const noResults = "No events found. Please update your search";

    function handleChange (event) {
        console.log(state)
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    const[searchResults, setSearchResults] = useState([])

    function update (){
        console.log(state)

        let path = '/search' + "/" + componentParams.userId

        if(state.event_name != null && state.event_name!= ""){
            path += "/"+ state.event_name
        }

        if(state.location != null && state.location!= ""){
            path += "/"+ state.location
        }

        if(state.event_type != null && state.event_type!= ""){
            path += "/"+ state.event_type
        }

        if(state.date != null && state.date!= ""){
            path += "/"+ state.date
        }
        history.push({
            pathname:  path
        })
        fetchData();
    }

    async function fetchData (){
        
        var dateConvert = null;
        if(state.date != null && state.date!= ""){
            var temp = new Date(state.date);
            dateConvert = temp.getTime() + temp.getTimezoneOffset()*60*1000
        } 
        await axios.get(configData.SERVER_URL + '/api/search_event', {
            params:{
                event_type: state.event_type,
                location: state.location,
                event_name: state.event_name,
                date: dateConvert
            }
        })
        .then((response) => {
            setSearchResults(response.data);
        })
        .catch((err) => {
            console.log(err);
        }) 
    };
    

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>
            <Header user_id= {componentParams.userId}/>

            <Container fluid>
            <div class="experiment-body-search-upper">
            <Form>
                <Form.Row className="align-items-center">
                    <Col sm={3}>
                        <Form.Label className={"search_filter_label"}>Keyword(s):</Form.Label>
                        <Form.Control id="event_name"  placeholder="Keyword(s)" value={state.event_name} onChange={handleChange} />
                    </Col>
                    <Col  sm={3}>
                    <Form.Label className={"search_filter_label"}>Location:</Form.Label>
                        <Form.Control id="location"  placeholder="Location" value={state.location} onChange={handleChange} />
                    </Col>
                    <Col  sm={3}>
                    <Form.Label className={"search_filter_label"}>Event Type:</Form.Label>
                        <Form.Control as="select"  id="event_type" value={state.event_type} onChange={handleChange}>
                            <option hidden value>Select an event type</option>
                                
                            <option value="Soccer">Soccer</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Football">Football</option>
                            <option value="Cricket">Cricket</option>
                            <option value="Hockey">Hockey</option>
                            <option value="Baseball">Baseball</option>
                            <option value="Lacrosse">Lacrosse</option>
                            <option value="Rugby">Rugby</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Tennis">Tennis</option>
                        </Form.Control>
                    </Col>
                    <Col  sm={3}>
                    <Form.Label className={"search_filter_label"}>Date:</Form.Label>
                    <Form.Control  input id="date"  type= "date" min={moment().format("YYYY-MM-DD")} value={state.date} onChange={handleChange} />
                    </Col>  
                </Form.Row>
                <Button variant="custom-search" onClick={update} >Update</Button>
            </Form>
            </div>
            </Container>

            <div className="experiment-body-search-lower">
                <div >
                {searchResults.length===0 && <div className="registeredMessage"> {noResults} </div>}
                    
                    {searchResults && searchResults.map((item) => (
                        <ListGroup>
                            <li class="modified-list2 d-flex justify-content-between align-items-center" key={item.id} >
                                <Link to={{pathname: '/event/' + componentParams.userId + "/" + item.id }} className="custom-color">
                                    {item.name}
                                </Link>
                                <span className="badge badge-info badge-pill">{item.location},  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(item.time))}</span>
                            </li>
                        </ListGroup>
                    ))}
                </div>
            </div>
        </div>

    )

}
export default Search;