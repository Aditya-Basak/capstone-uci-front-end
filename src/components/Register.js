import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import app_logo from '../SportsCon_Light_Transparent.png'
import {Alert, Button, Container, Row, Col, Form, Image} from 'react-bootstrap';
import S3FileUpload from 'react-s3';
import defaultImage from './assets/blank_profile.png'
import configData from '../config.json'

const config = {
    bucketName: 'sportscon',
    region: 'us-east-2',
    accessKeyId: 'AKIAR7QPABLSRJKY2D4D',
    secretAccessKey: '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'
}

function Register(props){
    const[state, setState] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: "",
    })

    const[file, setFile] = useState(defaultImage)
    const[S3File, setS3File] = useState(null)

    const[registeredMessage, setRegisteredMessage] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);
    const[alert1, setAlert1] = useState(false);
    const[alert2, setAlert2] = useState(false);
    const[alert3, setAlert3] = useState(false);
    const[alert4, setAlert4] = useState(false);
    const[alert5, setAlert5] = useState(false);
    const[alert6, setAlert6] = useState(false);
    const[alert7, setAlert7] = useState(false);
 
    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    function handleImageChange(event) {
        if(event.target.files.length!=0){
            setS3File(event.target.files[0])
            setFile(URL.createObjectURL(event.target.files[0]))
        }
    }

    const triggerFileInput = React.useRef(null);

    const handleImageUploadClick = event => {
        triggerFileInput.current.click();
    };

    async function handleSubmit (event){
        let uploadURL = null;
        if(S3File!==null){
            await S3FileUpload.uploadFile(S3File, config)
            .then((data)=>{
                uploadURL = data.location;
            })
            .catch((err)=>{
                console.log(err)
            })
        }


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
        if(state.name === "" && state.email === "" && state.password === "" && state.phonenumber === "")
            {
                setAlert5(true);
                setTimeout(() => { setAlert5(false);}, 3000);           
            }     
        else if(state.phonenumber == "")
        {
            setAlert1(true);
            setTimeout(() => { setAlert1(false);}, 3000);
        }
       else if(state.phonenumber.length != 10)
       {
            setAlert2(true);
            setTimeout(() => { setAlert2(false);}, 3000);
        }
        else if(validPhone == false)
        {
            setAlert3(true);
            setTimeout(() => { setAlert3(false);}, 3000);
        }
        else if(validEmail == false)
        {
            setAlert4(true);
            setTimeout(() => { setAlert4(false);}, 3000);
        }
        else if(state.password == "")
        {
            setAlert6(true);
                setTimeout(() => { setAlert6(false);}, 3000);
        }
        else{       
            await axios.post(configData.SERVER_URL + '/api/register_user', {
                name: state.name,
                email: state.email,
                password: state.password,
                phone: state.phonenumber,
                image: uploadURL
            })
            .then(res => {
                if(res.status === 200){
                    setAlert7(true);
                    document.getElementById("myBtn").disabled = true;
                    setTimeout(() => {window.location = '/';}, 3000);
                }
            })
        }
    }

    return (
        <Container className="register-page" fluid>
            <br/>
        <Alert className="alert-body" show={alert1} variant="danger">
                <Alert.Heading>Phone Number cannot be empty.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert1(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert2} variant="danger">
                <Alert.Heading>Phone Number should be numeric, 10 digits, and without any special characters.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert2(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert3} variant="danger">
                <Alert.Heading>Phone Number cannot begin with zero or have special characters.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert3(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert4} variant="danger">
                <Alert.Heading>Invalid Email ID.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert4(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert5} variant="danger">
                <Alert.Heading>All fields can not be empty.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert5(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert6} variant="danger">
                <Alert.Heading>Password cannot be empty.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert6(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert7} variant="success">
                <Alert.Heading>{state.name} has been successfully registered.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => {setAlert7(false); window.location ="/";}} variant="success">
                        Close
                    </Button>
                </div>
            </Alert>

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
            <Container fluid>
            <Row>
                <Col sm>
            <Form>
                {registeredMessage && <div className="registeredMessage"> {registeredMessage} </div>}
                <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={4}>Name:</Form.Label>
                    <Col sm>
                    <Form.Control size="lg" id="name"  placeholder="Your name." value={state.name} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <br />
                <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Form.Label column sm={4}>Email:</Form.Label>
                    <Col sm>
                    <Form.Control size="lg" id="email" type="email" placeholder="your_id@example.com" value={state.email} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <br/>
                <Form.Group as={Row} controlId="formHorizontalEmail">
                   <Form.Label column sm={4}>Password:</Form.Label>
                    <Col sm>
                    <Form.Control size="lg" id="password" type={isRevealPwd ? "text":"password"} placeholder="Something you can remember!" value={state.password} onChange={handleChange} />
                    <img class ="pwd-image" title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)} fluid/>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} controlId="formHorizontalNumber">
                    <Form.Label column sm={4}>Phone Number:</Form.Label>
                    <Col sm>
                    <Form.Control size="lg" id="phonenumber" placeholder="10 digits. No special characters." value={state.phonenumber} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <br/>
                
            </Form>
            </Col>
            <Col sm>
            
                <Form>
                    <Form.Group className="imgPreview">
                        <Form.Label>&emsp;Profile Image:</Form.Label>
                        <br/>
                        <Image className={"imgPreview"} src={file} rounded fluid/>
                        <Button className="file-div" variant="outline-warning" onClick={handleImageUploadClick}>Upload</Button> 
                        <input variant="outline-warning" ref={triggerFileInput} type="file" className="file-div" size="lg" style={{display: 'none'}} onChange={handleImageChange}/>
                </Form.Group>
                </Form>
                <br/>
            </Col>
            </Row>
            </Container>
            </div>
            <Button variant="success"  size='lg' id="myBtn" onClick={handleSubmit} className="registerButton"> Register </Button>{' '}
         </div>
         </Container>
    )
}

export default Register