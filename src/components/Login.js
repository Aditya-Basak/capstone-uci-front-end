import React,{useState} from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom';
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import app_logo from '../SportsCon_Light_Transparent.png'
import {Button, Alert, Row, Col, Form} from 'react-bootstrap';
import background from './assets/background.png'

function Login(props){

    const[state, setState] = useState({
        email: "",
        password: "",
    })

    const[isRevealPwd, setIsRevealPwd] = useState(false);
    const[alert1, setAlert1] = useState(false);

    let history = useHistory();

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    async function handleSubmit (event){
        event.preventDefault();

        await axios.get('http://localhost:8080/api/login_user', {
            params: {
            email: state.email,
            password: state.password
            }
        })
        .then(res => {
            if(res.status === 200){
                history.push({
                    pathname:  '/dashboard/' + res.data.id
                  })
            }
        })
        .catch(error => {
            setAlert1(true);
            setTimeout(() => {window.location = "/";}, 3000);
        });
    }
   


    return (
        <div className="login-home"
        class="bg_image"
        style={{
          backgroundImage: 'url('+background+')',
          backgroundSize: "cover",
          height: "100vh",
        }}
        
      >
        
        <br></br>
        <Alert className="alert-body" show={alert1} variant="danger">
            <Alert.Heading>Wrong Username/Password.</Alert.Heading>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {setAlert1(false); window.location = "/";}} variant="danger">
                    Close
                </Button>
            </div>
        </Alert>
        
        <br/><br/><br/>
            
        <div class="experiment-body-login2">
            
            <Form>
                <Form.Group as={Row}>
                    <Col sm>
                <a href="/">
                    <img class="fit-logo-login2"  src={app_logo}/>
                </a>
                    </Col>
                </Form.Group>
            </Form>
            
            <a class="h4" >
                    Sports are meant to be played together. <br/>You are just one step away!
            </a>
            <br></br>
            <br></br>
            <br></br>
            <Form>
                <Form.Group as={Row} controlId="formHorizontalName">
                    <Col sm={4}>
                    <Form.Control className={"login-centering"} size="lg" id="email"  placeholder="Enter email" value={state.email} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Col sm={4}>
                    <Form.Control className={"login-centering"} size="lg" id="password" type={isRevealPwd ? "text":"password"} placeholder="Enter password" value={state.password} onChange={handleChange}/>
                    <img  class="pwd-image-login" title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                    </Col>
                </Form.Group>
                <Button variant="success"  size='lg' id="myBtn" onClick={handleSubmit} className="registerButton"> Login </Button>
            </Form>
            <br/>
            <Link to="/register" style={{ textDecoration: "none" }}>
                <Button variant="link"  size='lg' style={{color:"#0dd466"}} id="myBtn"> Register Now </Button>
            </Link>
            <br></br>
            <br></br>
            </div>
            
         
         
         </div>

    )
}

export default Login;
