import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import { useHistory, useParams, useLocation } from "react-router-dom";
import axios from 'axios'
import moment from 'moment';
import {Button, Tab, Tabs, Container, Row, Col, Form, ListGroup} from 'react-bootstrap';
import configData from '../config.json';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

const override = css`
  margin: auto;
  margin-top: 20%;
`;

function Search(props){
    const componentParams = useParams();
    let history = useHistory();
    let [loading, setLoading] = useState(true);

    const locationSearch = useLocation();

    let eventNameString = new URLSearchParams(locationSearch.search).get('eventName');
    let locationString = new URLSearchParams(locationSearch.search).get('location');

    const[state, setState] = useState({
        event_name: eventNameString,
        location: locationString,
        event_type: "",
        date: ""
    })

    const noResults = "No events found. Please update your search";

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    const[searchResults, setSearchResults] = useState([])


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
        setLoading(false); 
    };
    

    useEffect(() => {
        fetchData();
    }, [])

    if(loading){
        return(
         <div className="sweet-loading">
         <ClipLoader color={"aqua"} loading={loading} css={override} size={110} />
         </div>
        )
    }
    
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
                <Button variant="custom-search" onClick={fetchData} >Update</Button>
            </Form>
            </div>
            </Container>

            <div className="experiment-body-search-lower">
                <div >
                {searchResults.length===0 && <div className="registeredMessage"> {noResults} </div>}
                    
                    {searchResults && searchResults.map((item) => (
                        <ListGroup>
                            <li class="modified-list d-flex justify-content-between align-items-center" key={item.id} >
                            <Container fluid>
                                <Row  className="modified-container">
                                    <Col className="modified-flex-dashboard" sm>
                                <Link to={{pathname: '/event/' + componentParams.userId + "/" + item.id }} className="custom-color">
                                    {item.name}
                                </Link>
                                </Col>
                                <Col  sm = {3}   style={{color:'white'}}>
                                        {item.location}
                                    </Col>
                                    <Col sm= {4} className="modified-flex-search">
                                    {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(item.time))}
                                    </Col>
                               
                                </Row>
                            </Container> 
                            </li>
                        </ListGroup>
                    ))}
                </div>
            </div>
        </div>

    )

}
export default Search;