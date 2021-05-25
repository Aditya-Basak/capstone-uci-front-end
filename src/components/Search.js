import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import {Button, Form, Col, Container} from 'react-bootstrap';
import axios from 'axios'
import moment from 'moment'

function Search(props){

    const[state, setState] = useState({
        event_name: props.location.event_name,
        location: props.location.location,
        event_type: null,
        date: null
    })

    const noResults = "No events found. Please update your search";

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    let history = useHistory();
    const backToDashboard = () => {
        history.push({
            pathname:  '/dashboard',
            user_id: props.location.user_id
        })
    }

    const[searchResults, setSearchResults] = useState([])

    async function fetchData (){
        var dateConvert = null;
        if(state.date !== null && state.date!== ""){
            var temp = new Date(state.date);
            dateConvert = temp.getTime() + temp.getTimezoneOffset()*60*1000
        } 
        await axios.get('http://localhost:8080/api/search_event', {
            params:{
                event_type: state.event_type,
                location: state.location,
                event_name: state.event_name,
                date: dateConvert
            }
        })
        .then((response) => {
            console.log(response);
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
            <Header user_id= {props.location.user_id}/>

            <Container fluid>
            <div class="experiment-body">
            <Form>
                <Form.Row className="align-items-center">
                    <Col className="my-1">
                        <Form.Label className={"search_filter_label"}>Keyword(s):</Form.Label>
                        <Form.Control id="event_name"  placeholder="Keyword(s)" value={state.event_name} onChange={handleChange} />
                    </Col>
                    <Col  className="my-1">
                    <Form.Label className={"search_filter_label"}>Location:</Form.Label>
                        <Form.Control id="location"  placeholder="Location" value={state.location} onChange={handleChange} />
                    </Col>
                    <Col  className="my-1">
                    <Form.Label className={"search_filter_label"}>Event Type:</Form.Label>
                        <Form.Control as="select"  id="event_type" value={state.event_type} onChange={handleChange}>
                            <option hidden value>Select an event type</option>
                                
                            <option value="Soccer">Soccer</option>
                            <option value="basketball">Basketball</option>
                            <option value="football">Football</option>
                            <option value="cricket">Cricket</option>
                        </Form.Control>
                    </Col>
                    <Col  className="my-1">
                    <Form.Label className={"search_filter_label"}>Date:</Form.Label>
                    <Form.Control  input id="date"  type= "date" min={moment().format("YYYY-MM-DD")} value={state.date} onChange={handleChange} />
                    </Col>  
                       
                </Form.Row>
                <Button onClick={fetchData} >Update</Button>
            </Form>
            </div>
            </Container>

            <div className="card">
                <div className="card-body">
                {searchResults.length===0 && <div className="registeredMessage"> {noResults} </div>}
                    
                    {searchResults && searchResults.map((item) => (
                        <ul className="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
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
                </div>
            </div>
            {<button onClick={backToDashboard} className="backButton" > Go Back </button>}
        </div>

    )

}
export default Search;