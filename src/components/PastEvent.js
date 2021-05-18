import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import { useHistory } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap'

function PastEvent(props){

    const[state, setState] = useState({
        event_id: props.location.componentProps.event_id,
        user_id: props.location.componentProps.user_id
    })

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

    const[socialRating, setSocialRating] = useState(0)
    const[eventRating, setEventRating] = useState(0)

    const[testimonial, setTestimonial] = useState("")


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
        }

        fetchData();
    }, []);

    let history = useHistory();
    const backToDashboard = () => {
        history.push({
            pathname:  '/dashboard',
            user_id: state.user_id
        })
    }

    function modalClick (item) {
        setShowModal(true)
        setModalState({
            name: item.name,
            user_id: item.id
        })
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
                }
            })
            .catch(error => {
                alert("Something went wrong, could not submit rating\n");
            });
    }

    return (
        <div>
        <Header/>
        <br/>
        <div className={"pastEvent"}>
        
        <br/>
        <div className={"pastEventOne"}>
        <h2 className="eventTitle" >{eventState.name}</h2>
        <div className="card">
            <div className="card-body">
                <h3 >Description</h3>
                {eventState.description}
            </div>
        </div>

        <br/>
        <h4 className="eventTitle">Event Details:</h4>
        <div className="card">
            <div className="card-body">
                <b>Location:</b> {eventState.location}
                {<br/>}
                <b>Date/Time:</b> {eventState.date}
                <br/>
                <b>Event Type:</b> {eventState.event_type}
                {<br/>}
                {<br/>}
                
                This is a {eventState.scope} event

                </div>
            </div>
            <br/>
        {<button onClick={backToDashboard} className="backButton" > Go Back </button>}
        </div>

        <div className={"pastEventTwo"}>
        <h4 className="eventTitle"> Rate Attendees:</h4> 
                <div className="card-body">
                {eventState.attendees && eventState.attendees.map((item) => (
                    <ul className="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
                                <b>{item.name}</b>
                            <button type="button" class="btn btn-success" onClick={() => modalClick(item)} >Rate</button>
                        </li>
                    </ul>
                    ))}
                </div>
                </div>
        
                </div>

                <Modal show={showModal} onHide={modalClose}>

                    <Modal.Header closeButton>
                        <Modal.Title >{eventState.name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <h5 class="text-center">Rate {modalState.name} </h5>
                    <br/>
                    <h5>Social Rating:</h5>
                    <ReactStars
                        count={5}
                        onChange={socialRatingChanged}
                        size={30}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                    />
                    <br/>
                    <h5>{eventState.event_type} Rating:</h5>
                    <ReactStars
                        count={5}
                        onChange={eventRatingChanged}
                        size={30}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                    />
                    <br/>
                    <form>
                        <div class="form-group">
                        <h5>Testimonial:</h5>
                            <textarea class="form-control" placeholder="Write a testimonial..." onChange={handleTestimonialChange}></textarea>
                        </div>
                    </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="success" onClick={handleRatingSubmit} >Submit Rating</Button>
                    </Modal.Footer>

                </Modal>
        </div>
    )

}

export default PastEvent;