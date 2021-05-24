import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom';
import app_logo from '../SportsCon_Light_Transparent.png'
import {Nav, Navbar, Row, Col} from 'react-bootstrap';

function RegisterHeader(props){

    const[state, setState] = useState({
        name: "",
        user_id: props.user_id,
    })
    
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
            params: {
                user_id: props.user_id
            }
        });
        
        setState({name: result.data.account_details.name,
                    user_id: result.data.account_details.user_id,});
    },[]);
        return(
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    <img 
                    src={app_logo}
                    width="120"
                    height="30"
                    className="d-inline-block align-top"
                    />                
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-nav-bar"/>
                    <Navbar.Collapse className="justify-content-end">
                        <Row>
                            <Col>
                                <Nav.Link href="#">Events</Nav.Link>
                            </Col>
                            <Col>
                                <Nav.Link href="#">Groups</Nav.Link>
                            </Col>
                            <Col>
                                <Nav.Link href="#">Leaderboard</Nav.Link>
                            </Col>
                        </Row>
                    </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Welcome,&nbsp;  
                    <Link to={{pathname: '/userProfile',
                                    componentProps: {
                                        user_id: props.user_id
                                    }}} style={{ textDecoration: "none" }}>
                        {state.name}
                        </Link>
                        &nbsp;&nbsp;
                </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        );
}

export default RegisterHeader