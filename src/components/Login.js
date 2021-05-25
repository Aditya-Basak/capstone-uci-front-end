import React,{useState} from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom';
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import app_logo from '../SportsCon_Light_Transparent.png'
import {Button, Container, Row, Col, Form} from 'react-bootstrap';
import background from './assets/background.png'

function Login(props){

    const[state, setState] = useState({
        email: "",
        password: "",
    })

    const[isRevealPwd, setIsRevealPwd] = useState(false);

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
                    pathname:  '/dashboard',
                    user_id: res.data.id
                  })
            }
        })
        .catch(error => {
            alert("Wrong username/password.");
            window.location = "/";
        });
    }
   


    return (
        <div
        class="bg_image"
        style={{
          backgroundImage: 'url('+background+')',
          backgroundSize: "cover",
          height: "110vh",
        }}
      >
        <Container fluid>
        <br></br>
            <br></br>
        <div>
            <div class="experiment-body-login">
            <div class="logo">
                <a href="/">
                    <img class="fit-logo-login"  src={app_logo}/>
                </a>
            </div>

            <a class="h4 center" >
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
                    <Form.Control className={"login-centering"} size="lg" id="password" type={isRevealPwd ? "text":"password"} placeholder="Enter password" value={state.password} onChange={handleChange} />
                    <img class ="pwd-image" title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)} fluid/>
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
         </Container>
         </div>

    )
}

export default Login;
