import React, {useState} from 'react'
import axios from 'axios'
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import app_logo from '../SportsCon_Light_Transparent.png'
import {Button, Container, Row, Col, Form} from 'react-bootstrap';
function Register(props){
    const[state, setState] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: "",
    })

    const[registeredMessage, setRegisteredMessage] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    async function handleSubmit (event){
        event.preventDefault();
        var validPhone = true;
       var i;
       for(i = 0; i < state.phonenumber.length; i++)
       {
           var x = state.phonenumber.charCodeAt(i);
           if(i == 0 && x  == 48)
                validPhone = false;
            else if(x < 48 || x > 57)
                validPhone = false;

        }
        var validEmail = false;
        var check1 = false;
        var check2 = false;
        for(i = 0; i < state.email.length; i++)
        {
            var x = state.email.charCodeAt(i);
            if(x == 64)
                check1 = true;
            if(x  == 46 && check1 == true)
                check2 = true;
        }
        if(check1 == true && check2 == true)
            validEmail = true;

       if(state.phonenumber == "")
               alert("New Phone Number cannot be empty.");
       else if(state.phonenumber.length != 10)
                alert("Phone Number should be numeric, 10 digits, and without any special characters.");
        else if(validPhone == false)
                alert("Phone Number cannot begin with zero or have special characters.");
        else if(validEmail == false)
                alert("Invalid Email ID.");
        else if(state.name == "" || state.email == "" || state.password == "" || state.phone == "")
                    alert("All the fields are REQUIRED.");        
        else{        
            await axios.post('http://localhost:8080/api/register_user', {
                name: state.name,
                email: state.email,
                password: state.password,
                phone: state.phonenumber
            
            })
            .then(res => {
                if(res.status === 200){
                    setRegisteredMessage(state.name + " has been registered!");
                    document.getElementById("myBtn").disabled = true;
                }
            })
        }
    }

    return (
        <Container fluid>
        <div>
            <div class="logo">
                <a href="/">
                    <img class="fit-logo"  src={app_logo}/>
                </a>
            </div>
            
            <div class="experiment-body">
            <h2>
                    Enter your details to hop on board!<br/><br/>
            </h2>
            <Form>
                {registeredMessage && <div className="registeredMessage"> {registeredMessage} </div>}
                <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>Name:</Form.Label>
                    <Col sm={4}>
                    <Form.Control size="lg" id="name"  placeholder="What does everyone call you?" value={state.name} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <br />
                <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>Email:</Form.Label>
                    <Col sm={4}>
                    <Form.Control size="lg" id="email" type="email" placeholder="your_id@example.com" value={state.email} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <br/>
                <Form.Group as={Row} controlId="formHorizontalEmail">
                   <Form.Label column sm={2}>Password:</Form.Label>
                    <Col sm={4}>
                    <Form.Control size="lg" id="password" type={isRevealPwd ? "text":"password"} placeholder="Something you can remember!" value={state.password} onChange={handleChange} />
                    <img class ="pwd-image" title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)} fluid/>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="formHorizontalNumber">
                    <Form.Label column sm={2}>Phone Number:</Form.Label>
                    <Col sm={4}>
                    <Form.Control size="lg" id="phonenumber" placeholder="10 digits. No special characters." value={state.phonenumber} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <br/>
            </Form>
            </div>
            <Button variant="success"  size='lg' id="myBtn" onClick={handleSubmit} className="registerButton"> Register </Button>{' '}
         </div>
         </Container>
    )
}

export default Register