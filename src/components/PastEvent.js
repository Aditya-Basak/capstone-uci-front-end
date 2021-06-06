import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import { useHistory , Link, useParams} from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import axios from 'axios'
import {Alert, Container, Row, Col, Modal, Button, ListGroup, Image } from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import defaultImage from './assets/blank-profile-no-tag.png'

const override = css`
  margin: auto;
  margin-top: 20%;
`;

function PastEvent(props){
    const componentParams = useParams();

    const[state, setState] = useState({
        event_id: componentParams.eventId,
        user_id: componentParams.userId
    })

    let [loading, setLoading] = useState(true);

    const[eventState, setEventState] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        event_type: "",
        remainining_spots: 0,
        scope: "",
        attendees: []
    })

    const[showModal, setShowModal] = useState(false)

    const[modalState, setModalState] = useState({
        name: "",
        user_id: 0
    })

    const[socialRating, setSocialRating] = useState(1)
    const[eventRating, setEventRating] = useState(1)

    const[testimonial, setTestimonial] = useState("")
    const[alert2, setAlert2] = useState(false);
    const[alert3, setAlert3] = useState(false);
    

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:8080/api/get_event', {
            params:{
                user_id: state.user_id,
                event_id: state.event_id
            }
        })
        .then((response) => {
            const date = new Date(response.data.time);
            let dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date)
            
            setEventState({
                name: response.data.name,
                description: response.data.description,
                location: response.data.location,
                date: dateFormat,
                event_type: response.data.event_type,
                remainining_spots: response.data.remainining_spots,
                scope: response.data.scope,
                attendees: response.data.attendees
            })
        })
        .catch((err) => {
            console.log(err);
        }) 
        setLoading(false);
        }

        fetchData();
    }, [showModal]);


    function modalClick (item) {
        setShowModal(true)
        setModalState({
            name: item.name,
            user_id: item.id,
            image: item.image
        })
    }

    function handleEditRating(item){
        setSocialRating(item.socialRating)
        setEventRating(item.skillRating)
        setTestimonial(item.review)
        modalClick(item)
    }

    function modalClose(){
        setShowModal(false)
        setTestimonial("")
        setSocialRating(0)
        setEventRating(0)
    }

    const socialRatingChanged = (newRating) => {
        setSocialRating(newRating)
    };

    const eventRatingChanged = (newRating) => {
        setEventRating(newRating)
    };

    const noResults = "Sorry. No one participated in this event.";

    function handleTestimonialChange (event) {
        setTestimonial(event.target.value)
    }

    async function handleRatingSubmit(){
        await axios.post('http://localhost:8080/api/rate_user', {
                event_id: state.event_id,
                social_rating: socialRating,
                skill_rating: eventRating,
                review: testimonial
            },
            {
                params: {
                    user_id: modalState.user_id,
                    rater_id: state.user_id
                }, 
            })
            .then(res => {
                if(res.status === 200){
                    modalClose();
                    setAlert3(true);
                    setTimeout(() => {setAlert3(false);}, 3000);
                }
            })
            .catch(error => {
                modalClose();
                setAlert2(true);
            });
    }

    if(loading){
        return(
         <div className="sweet-loading">
         <Header user_id= {componentParams.userId}/>
         <ClipLoader color={"aqua"} loading={loading} css={override} size={110} />
         </div>
        )
    }
    
    return (
        <div>
        <Header user_id= { state.user_id}/>
        <br/>
        <Alert className="alert-body" show={alert2} variant="danger">
            <Alert.Heading>Something went wrong. Could not submit ratings.</Alert.Heading>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {setAlert2(false);}} variant="danger">
                    Close
                </Button>
            </div>
        </Alert>

        <Alert className="alert-body" show={alert3} variant="success">
            <Alert.Heading>Ratings submitted successfully.</Alert.Heading>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {setAlert3(false);}} variant="success">
                    Close
                </Button>
            </div>
        </Alert>

        <Container fluid>
            <div className="name-div">
                <h1>{eventState.name}</h1>
            </div>
            <Row>
                <Col sm>
                    <div className="name-div">
                        <br />
                        <h2>Description</h2>
                        <div className="experiment-body-event-upper">
                            {eventState.description}
                    </div>

                    <h2>Event Details</h2>
                        <div className="experiment-body-event-lower">
                            <Row> 
                                <Col sm={6}>
                                    Location:
                                </Col>   
                                <Col sm={5} style={{color:'white'}}>
                                    {eventState.location}
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col sm={6}>
                                    Event Type:
                                </Col>   
                                <Col sm={5} style={{color:'white'}}>
                                    {eventState.event_type}
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col sm={6}>
                                    Date/Time:
                                </Col>   
                                <Col sm={5} style={{color:'white'}}>
                                    {eventState.date}
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col sm={6}>
                                    Spots Unfilled:
                                </Col>   
                                <Col sm={5} style={{color:'white'}}>
                                    {eventState.remainining_spots}
                                </Col>
                            </Row>
                            <br/>
                            <div style={{color:'white'}}>
                                <b>This was a {eventState.scope} event.</b>
                            </div>
                            <br/>
                        </div>
                    </div>
                </Col>        

                <Col sm>
                    <div className="name-div">
                        <br />
                        <h2>Attendees</h2>
                        <div className="experiment-body-event-attendees">
                            {eventState.attendees.length===0 && <div className="registeredMessage"> {noResults} </div>}
                            {eventState.attendees && eventState.attendees.map((item) => 
                                (
                                    <ListGroup>

                                        {item.id == state.user_id && 
                                            <li class="modified-list-attendees d-flex justify-content-between align-items-center" key={item.id} >

                                                {item.image=== null &&
                                                    <Image className={"event-image"} src={defaultImage} roundedCircle/>
                                                }
                                                {item.image!== null &&
                                                    <Image className={"event-image"} src={item.image} roundedCircle/>
                                                }
                                                
                                                <Link  to={{pathname: '/userProfile/' + state.user_id + "/" + item.id + "/" + true }} className="custom-color" style={{ textDecoration: "none" }}>
                                                {item.name}
                                                </Link>
                                            </li>
                                        }

                                        {item.id != state.user_id && 
                                            <li class="modified-list-attendees d-flex justify-content-between align-items-center" key={item.id} >

                                                {item.image=== null &&
                                                    <Image className={"event-image"} src={defaultImage} roundedCircle/>
                                                }
                                                {item.image!== null &&
                                                    <Image className={"event-image"} src={item.image} roundedCircle/>
                                                }
                                                
                                                <Link  to={{pathname: '/userProfile/' + state.user_id + "/" + item.id + "/" + false }} className="custom-color" style={{ textDecoration: "none" }}>
                                                {item.name}
                                                </Link>
                                            {item.rated && <Button variant="success" onClick={() => handleEditRating(item)} >Edit Rating</Button> }
                                            {!item.rated && <Button variant="success" onClick={() => modalClick(item)} >Rate</Button> }
                                            </li>
                                        }
                                    </ListGroup>                                            
                                ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    

                <Modal  show={showModal} backdrop="static" onHide={modalClose} keyboard={false}>

                    <Modal.Header className="my-modal-borders" closeButton>
                        <Modal.Title >{eventState.name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="my-modal-body">
                    <h5 class="name-heading">Rate {modalState.name} </h5>
                    <br/>
                    <Container>
                        <Row>
                            <Col sm>
                            <h5>Social Rating:</h5>
                    <ReactStars 
                        count={5}
                        onChange={socialRatingChanged}
                        size={30}
                        value={socialRating}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#1fc600"
                    />
                    <br/>
                    <h5>{eventState.event_type} Rating:</h5>
                    <ReactStars 
                        count={5}
                        onChange={eventRatingChanged}
                        size={30}
                        value={eventRating}
                        
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#1fc600"
                    />
                    <br/>
                            </Col>
                            <Col sm>
                            {modalState.image=== null &&
                                                    <Image className={"modal-image"} src={defaultImage} roundedCircle/>
                                                }
                                                {modalState.image!== null &&
                                                    <Image className={"modal-image"} src={modalState.image} roundedCircle/>
                                                }
                            </Col>
                        </Row>
                    </Container>
                    
                    <form>
                        <div class="form-group">
                        <h5>Testimonial:</h5>
                            <textarea class="form-control" placeholder="Write a testimonial...(Optional)" value={testimonial} onChange={handleTestimonialChange}></textarea>
                        </div>
                    </form>
                    </Modal.Body>

                    <Modal.Footer className="my-modal-borders">
                        <Button variant="success" onClick={handleRatingSubmit} >Submit Rating</Button>
                        <Button variant="secondary" onClick={modalClose} >Cancel</Button>
                    </Modal.Footer>

                </Modal>
        </div>
    )

}

export default PastEvent;