import React, {useEffect, useState} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import { css } from "@emotion/react";
import ReactStars from "react-rating-stars-component";
import {Button, Container, Row, Col, Form, ListGroup} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  margin: auto;
  margin-top: 20%;
`;

function UserProfile(props){
    let [loading, setLoading] = useState(true);

    let history = useHistory();
    
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
        const fetchData = async () => {
        var id_to_get = props.location.componentProps.user_id
        if(!props.location.componentProps.show_own_profile){
            id_to_get = props.location.componentProps.see_profile_user_id
        }
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
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
                  setLoading(false)   
        }

        fetchData();
    },[props.location.componentProps.show_own_profile]);

    const[phEditMsg, setPhEditMsg] = useState('');
    const[pwdEditMsg, setPwdEditMsg] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);

    const backToDashboard = () => {
        history.push({
            pathname:  '/dashboard',
            user_id: props.location.componentProps.user_id
        })
    }

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
    }

    async function handlePwdSubmit (event){
         event.preventDefault();
    
        if(state.password == "")
                alert("New Password cannot be empty.");
        
        else{

            await axios.put('http://localhost:8080/api/edit_user', {
                name: state.name,
                password: state.password,
                phone: state.phone,
            },
            {
                params:{
                    user_id: props.location.componentProps.user_id
                }
            })
            .then(res => {
                if(res.status === 200){
                    setPwdEditMsg("Password successfully changed.");
                    setPhEditMsg("");
                }
            })
            .catch(error => {
                alert("Something went wrong. Retry modifying.\n"+error);
                window.location = "/editUser";
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
               alert("New Phone Number cannot be empty.");
       else if(state.phone.length != 10)
                alert("Phone Number should be numeric, 10 digits, and without any special characters.");
        else if(valid == false)
                alert("Phone Number cannot begin with zero or have special characters.");
       else{
           await axios.put('http://localhost:8080/api/edit_user', {
               name: state.name,
               password: state.password,
               phone: state.phone,
           },
           {
               params:{
                   user_id: props.location.componentProps.user_id
               }
           })
           .then(res => {
               if(res.status === 200){
                   setPhEditMsg("Phone Number successfully changed.");
                   setPwdEditMsg("");
               }
           })
           .catch(error => {
               alert("Something went wrong. Retry modifying.\n"+error);
               window.location = "/editUser";
           });
       }
   }

   if(loading){
       return(
        <div className="sweet-loading">
        <Header user_id= {props.location.componentProps.user_id}/>
        <ClipLoader color={"white"} loading={loading} css={override} size={150} />
        </div>
       )
   }
    
    return (
       
        <div>
            <Header user_id= {props.location.componentProps.user_id}/>
            {props.location.componentProps.show_own_profile && <Container fluid>
                    <div className="name-div">
                        <h1>
                            &emsp;{state.name}
                        </h1>
                    </div>
                    <br />
            <div class="experiment-body">
                {phEditMsg && <div className="editedMessage"> {phEditMsg} </div>}
                {pwdEditMsg && <div className="editedMessage"> {pwdEditMsg} </div>}
                    
                <br />
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>Email:</Form.Label>
                            <Col sm={3}>
                                <Form.Control size="lg" id="email" type="email" value={state.email} onChange={handleChange} readOnly />
                            </Col>
                    </Form.Group>
                <br />
                <Form.Group as={Row} controlId="formHorizontalEmail">
                   <Form.Label column sm={2}>Password:</Form.Label>
                    <Col sm={3}>
                    <Form.Control size="lg" id="password"  type={isRevealPwd ? "text":"password"} placeholder="New Password" value={state.password} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <img class="pwd-image-profile" title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                    </Col>
                    <Col sm={1}>
                    <Button variant="outline-warning" size="md" onClick={handlePwdSubmit} className="editButton"> Update </Button>  
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalNumber">
                    <Form.Label column sm={2}>Phone Number:</Form.Label>
                    <Col sm={3}>
                    <Form.Control size="lg" id="phone"  placeholder="New Number" value={state.phone} onChange={handleChange} />
                    </Col>
                    <Col sm={1}>
                    <Button variant="outline-warning" size="md" onClick={handlePhSubmit} className="editButton"> Update </Button>  
                    </Col>
                </Form.Group>
                </Form>
            </div>
            </Container>
            }

            {!props.location.componentProps.show_own_profile && 
                <div className="name-div">
                    <h1>
                        {state.name}'s profile:
                    </h1>
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
                                            <li class="modified-list-testimonials d-flex justify-content-between align-items-center" key={item.id} >
                                                {item}
                                            </li>
                                        </ListGroup>
                                    ))}
                            </div>
                        </div>

                    </Col>
                    
                </Row>
            </Container>
            {<button onClick={backToDashboard} className="backButton" > Go Back </button>}
         </div>
         

    )
}

export default UserProfile