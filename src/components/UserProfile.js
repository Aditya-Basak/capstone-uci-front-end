import React, {useEffect, useState} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'
import { useParams } from "react-router-dom";
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import { css } from "@emotion/react";
import ReactStars from "react-rating-stars-component";
import {Alert, Button, Container, Row, Col, Form, ListGroup, Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import S3FileUpload from 'react-s3';
import defaultImage from './assets/blank-profile-no-tag.png'
import configData from '../config.json'

const config = {
    bucketName: 'sportscon',
    region: 'us-east-2',
    accessKeyId: 'AKIAR7QPABLSRJKY2D4D',
    secretAccessKey: '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'
}

const override = css`
  margin: auto;
  margin-top: 20%;
`;

function UserProfile(props){
    const componentParams = useParams();
    const[alert1, setAlert1] = useState(false);
    const[alert2, setAlert2] = useState(false);
    const[alert3, setAlert3] = useState(false);
    const[alert4, setAlert4] = useState(false);
    const[alert5, setAlert5] = useState(false);
    const[alert6, setAlert6] = useState(false);

    let [loading, setLoading] = useState(true);

    const[file, setFile] = useState(null)
    const[S3File, setS3File] = useState(null)
    
    const[state, setState] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        reviews: [],
        social_rating: null,
        total_social_ratings: null,
        event_ratings: []
    })
    
    useEffect(() => {
        console.log(componentParams)
        const fetchData = async () => {
        var id_to_get = componentParams.userId
        if(componentParams.showEdit === "false"){
            id_to_get = componentParams.seeUserId
        }
        const result = await axios.get(configData.SERVER_URL + '/api/get_user_profile',{
            params: {
                user_id: id_to_get
            }
        });
        
        setState({name: result.data.account_details.name,
                  email: result.data.account_details.email,
                  password: result.data.account_details.password,
                  phone: result.data.account_details.phone,
                  reviews: result.data.reviews,
                  social_rating: result.data.social_rating,
                  total_social_ratings: result.data.total_social_ratings,
                  event_ratings: result.data.event_ratings});

        if(result.data.account_details.image !== null){
            setFile(result.data.account_details.image);
        } 

        if(result.data.account_details.image === null){
            setFile(defaultImage)
        }
                  setLoading(false)   
        }

        fetchData();
    },[componentParams.showEdit]);

    const[phEditMsg, setPhEditMsg] = useState('');
    const[pwdEditMsg, setPwdEditMsg] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);
    const[imageChanged, setImageChanged] = useState(false);

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    }

    async function updateProfileImage(){
        let uploadURL = null;
        if(S3File!==null){
            await S3FileUpload.uploadFile(S3File, config)
            .then((data)=>{
                uploadURL = data.location;
            })
            .catch((err)=>{
                console.log(err)
            })

            await axios.put(configData.SERVER_URL + '/api/edit_user', {
                name: state.name,
                password: state.password,
                phone: state.phone,
                image: uploadURL
            },
            {
                params:{
                    user_id: componentParams.userId
                }
            })
            .then(res => {
                if(res.status === 200){
                    setPwdEditMsg("Profile image successfully changed.");
                    setTimeout(() => {setPwdEditMsg("");}, 3000);
                }
            })
            .catch(error => {
                alert("Something went wrong. Retry modifying.\n"+error);
                window.location = "/editUser";
            });
            setFile(uploadURL)
            setImageChanged(false)
        }
    }

    function handleImageChange(event) {
        if(event.target.files.length!=0){
            setImageChanged(true)
            setS3File(event.target.files[0])
            setFile(URL.createObjectURL(event.target.files[0]))
        }
    }

    const triggerFileInput = React.useRef(null);

    const handleImageUploadClick = event => {
        triggerFileInput.current.click();
    };

    async function handlePwdSubmit (event){
         event.preventDefault();
    
        if(state.password == "")
                setAlert5(true);
        
        else{

            await axios.put(configData.SERVER_URL + '/api/edit_user', {
                name: state.name,
                password: state.password,
                phone: state.phone,
                image: file
            },
            {
                params:{
                    user_id: componentParams.userId
                }
            })
            .then(res => {
                if(res.status === 200){
                    setPhEditMsg("");
                    setPwdEditMsg("Password successfully changed.");
                    setTimeout(() => {setPwdEditMsg("");}, 3000);
                    
                }
            })
            .catch(error => {
                setAlert6(true);
                setTimeout(() => {window.location = '/userProfile/' + props.user_id +  "/" + true;}, 3000);
            });
        }
    }

    async function handlePhSubmit (event){
        event.preventDefault();
      
       var valid = true;
       var i;
       for(i = 0; i < state.phone.length; i++)
       {
           var x = state.phone.charCodeAt(i);
           if(i == 0 && x  == 48)
                valid = false;
            else if(x < 48 || x > 57)
                valid = false;

        }
          
        if(state.phone == "")
            setAlert1(true);
        else if(state.phone.length != 10)
            setAlert2(true);
        else if(valid == false)
            setAlert3(true);    
        else{
           await axios.put(configData.SERVER_URL + '/api/edit_user', {
               name: state.name,
               password: state.password,
               phone: state.phone,
               image: file
           },
           {
               params:{
                   user_id: componentParams.userId
               }
           })
           .then(res => {
               if(res.status === 200){
                   setPwdEditMsg("");
                   setPhEditMsg("Phone Number successfully changed.");
                   setTimeout(() => {setPhEditMsg("");}, 3000);
               }
           })
           .catch(error => {
               setAlert4(true);
               setTimeout(() => {window.location = '/userProfile/' + props.user_id +  "/" + true;}, 3000);
           });
       }
   }

   if(loading){
       return(
        <div className="sweet-loading">
        <Header user_id= {componentParams.userId}/>
        <ClipLoader color={"white"} loading={loading} css={override} size={150} />
        </div>
       )
   }
    
    return (
       
        <div>
            <Header user_id= {componentParams.userId}/>
            {componentParams.showEdit === "true" && <Container fluid>
                    <div className="name-div">
                        <h1>
                            &emsp;{state.name}
                        </h1>
                    </div>
            
            <Alert className="alert-body" show={alert1} variant="danger">
                <Alert.Heading>New Phone Number cannot be empty.</Alert.Heading>
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
                <Alert.Heading>Something went wrong. Retry modifying.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => {setAlert4(false); window.location = '/userProfile/' + props.user_id +  "/" + true;}} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert5} variant="danger">
                <Alert.Heading>New Password cannot be empty.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setAlert5(false)} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <Alert className="alert-body" show={alert6} variant="danger">
                <Alert.Heading>Something went wrong. Retry modifying.</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => {setAlert6(false); window.location = '/userProfile/' + props.user_id +  "/" + true;}} variant="danger">
                        Close
                    </Button>
                </div>
            </Alert>

            <br />
            <div class="experiment-body-profile">
                {phEditMsg && <div className="editedMessage"> {phEditMsg} </div>}
                {pwdEditMsg && <div className="editedMessage"> {pwdEditMsg} </div>}
                    
                <br />
                <Container fluid>
                    <Row>
                        <Col sm>
                            <br/>
                            <Form>
                                <Form.Group as={Row} controlId="formHorizontalEmail">
                                    <Form.Label column sm={4}>Email:</Form.Label>
                                        <Col sm={7}>
                                            <Form.Control size="lg" id="email" type="email" value={state.email} onChange={handleChange} readOnly />
                                        </Col>
                                </Form.Group>
                                <br />
                                <Form.Group as={Row} controlId="formHorizontalEmail">
                                <Form.Label column sm={4}>Password:</Form.Label>
                                    <Col sm>
                                    <Form.Control size="lg" id="password"  type={isRevealPwd ? "text":"password"} placeholder="New Password" value={state.password} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                                    <img class="pwd-image-profile" title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                                    </Col>
                                    <Col sm={1}>
                                    <Button variant="outline-warning" size="md" onClick={handlePwdSubmit} className="editButton"> Update </Button>  
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formHorizontalNumber">
                                    <Form.Label column sm={4}>Phone Number:</Form.Label>
                                    <Col sm>
                                    <Form.Control size="lg" id="phone"  placeholder="New Number" value={state.phone} onChange={handleChange} />
                                    </Col>
                                    <Col sm={1}>
                                    <Button variant="outline-warning" size="md" onClick={handlePhSubmit} className="editButton"> Update </Button>  
                                    </Col>
                                </Form.Group>
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
                                <br></br>
                                <Button variant="outline-warning" size="md" disabled={!imageChanged} onClick={updateProfileImage} className="editButton"> Update Image</Button> 
                        </Form.Group>
                        </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            </Container>
            }


            {componentParams.showEdit === "false" && 
                <div className="name-div">
                    <h1>
                        &emsp;{state.name}'s profile:
                    </h1>
                    <br/>
                </div>
                
            }

            {componentParams.showEdit === "false" && 
                <div className="experiment-body-profile-others">
                    <Container fluid>
                        <Row>
                            <Col sm>
                                <br/>
                                <br/>
                                <Form>
                                    <Form.Group as={Row} controlId="formHorizontalEmail">
                                        <Form.Label column sm={4}>Email:</Form.Label>
                                            <Col sm>
                                                <Form.Control size="lg" id="email" type="email" value={state.email} readOnly />
                                            </Col>
                                    </Form.Group>
                                    <br />
                                    
                                    <Form.Group as={Row} controlId="formHorizontalNumber">
                                        <Form.Label column sm={4}>Phone Number:</Form.Label>
                                        <Col sm>
                                        <Form.Control size="lg" id="phone"  placeholder="New Number" value={state.phone} readOnly />
                                        </Col>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm>
                            <Form>
                                <Form.Group>
                                    <Form.Label>&emsp;Profile Image:</Form.Label>
                                    <br/>
                                    <Image className={"imgPreview"} src={file} rounded fluid/>
                                    
                            </Form.Group>
                            </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>

            }
            
            <Container fluid>
                <Row>
                    <Col sm>
                        <div className ="experiment-body-ratings">
                            <h2>
                                &emsp;Ratings:
                            </h2>
                            <br></br>
                                
                                    <div className="experiment-body-ratings-outer" >
                                    <Form>
                                    <Form.Group as={Row} controlId="formHorizontalEmail">
                                    <Col sm={5}>
                                    <Form.Label column="lg">Social:</Form.Label>
                                    </Col>
                                            <Col className="center" sm={3}>
                                    {state.social_rating &&
                                    <ReactStars
                                        count={5}
                                        size={35}
                                        value={state.social_rating}
                                        edit={false}
                                        emptyIcon={<i className="far fa-star"></i>}
                                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                                        fullIcon={<i className="fa fa-star"></i>}
                                        activeColor="#1fc600"
                                    />
                                    }
                                    </Col>
                                                <Col sm={3}>
                                                <Form.Label column="lg" lg={4}>({state.total_social_ratings})</Form.Label>
                                            </Col>
                                            </Form.Group>
                                    </Form>
                                    </div>
                                <div className="experiment-body-ratings-inner">
                                <Form>
                                {state.event_ratings.map((item) => (
                                    (
                                        
                                        <Form.Group as={Row} controlId="formHorizontalEmail">
                                            <Col sm={5}>
                                                <Form.Label column="lg" >{item.event_key}:</Form.Label>
                                            </Col>
                                            <Col className="center" sm={3}>
                                                <ReactStars
                                                    count={5}
                                                    size={35}
                                                    value={item.rating}
                                                    edit={false}
                                                    emptyIcon={<i className="far fa-star"></i>}
                                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                    fullIcon={<i className="fa fa-star"></i>}
                                                    activeColor="#1fc600"
                                                />
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Label column="lg" lg={3}>({item.total_ratings})</Form.Label>
                                            </Col>
                                                
                                        </Form.Group>
                                    )
                                ))}
                                </Form>
                                </div>
                        </div>
                    </Col>
                    <Col sm>

                        <div className ="experiment-body-testimonials">
                            <h2>
                                &emsp;Testimonials:
                            </h2>
                            <div className ="experiment-body-testimonials-inner">
                                {state.reviews && state.reviews.map((item) => 
                                    (
                                        <ListGroup>
                                            {item!== "" &&
                                            <li class="modified-list-testimonials d-flex justify-content-between align-items-center" key={item.id} >
                                                "{item}"
                                            </li>
                                            }
                                        </ListGroup>
                                    ))}
                            </div>
                        </div>

                    </Col>
                    
                </Row>
            </Container>
         </div>
         

    )
}

export default UserProfile