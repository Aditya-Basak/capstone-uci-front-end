import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom';
import app_logo from '../SportsCon_Light_Transparent.png'
import {Nav, Navbar, NavDropdown, Row, Col} from 'react-bootstrap';

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

    async function handleLogout (event){
        alert("You have been successfully logged out.");
        window.location.href ="/";
    }
        return(
            <Navbar className="color-nav" variant="dark">
                <Navbar.Text> &emsp;</Navbar.Text>
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
                <Navbar.Text>
                    Welcome,&ensp;  
                    <Link to={{pathname: '/userProfile/' + props.user_id +  "/" + true}} style={{ textDecoration: "none" }}>
                        {state.name}
                        </Link>
                        &emsp; &emsp;
                </Navbar.Text>
                    <NavDropdown title=" More Actions" id="navbarScrollingDropdown">
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Navbar.Text> &ensp;</Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        );
}

export default RegisterHeader