import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom';
import app_logo from '../SportsCon_Light_Transparent.png'
import defaultImage from './assets/blank-profile-no-tag.png'
import {Nav, Navbar, NavDropdown, Modal, Button, Image} from 'react-bootstrap';

function RegisterHeader(props){

    const[state, setState] = useState({
        name: "",
        image: defaultImage,
        user_id: props.user_id,
    })
    const[showModal, setShowModal] = useState(false)

    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
            params: {
                user_id: props.user_id
            }
        });
                   
        setState({name: result.data.account_details.name,
                    user_id: result.data.account_details.user_id,
                    image:result.data.account_details.image});
    },[]);

    
    function modalClick () {
        setShowModal(true)
    }
    async function handleLogout (event){
        window.location.href ="/";
    }
        return(
            <div>
            <Navbar className="color-nav" variant="dark">
                <Navbar.Text> &emsp;</Navbar.Text>
                <Navbar.Brand href={"/dashboard/" + props.user_id}>
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
                        <Link to={{pathname: '/userProfile/' + props.user_id +  "/" + true}} style={{ textDecoration: "none" }}>
                        <Image className="navbar-image"  src={state.image?state.image:defaultImage} rounded></Image>
                        </Link>
                </Navbar.Text>
                    <NavDropdown title=" More Actions" id="navbarScrollingDropdown">
                    <NavDropdown.Item onClick={modalClick}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Navbar.Text> &ensp;</Navbar.Text>
                </Navbar.Collapse>
                
            </Navbar>
            
            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-90w" backdrop="static"  keyboard={false}>
                <Modal.Header className="my-modal-borders">
                    <Modal.Title>{state.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="my-modal-body">You have been successfully logged out!</Modal.Body>
                
                <Modal.Footer className="my-modal-borders">
                    <Button variant="success" onClick={handleLogout} >Okay</Button>    
                </Modal.Footer>
            </Modal>
            
            </div>
        );
}

export default RegisterHeader