import React, {useState} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'

function CreateEvent(props){
    const[state, setState] = useState({
        name: "",
        type: "",
        description: "",
        location: "",
        date: "",
        time: "",
        limit: "",
        visibility: "",
    })

    const[createdMessage, setCreatedMessage] = useState('');

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    async function handleSubmit (event){
        event.preventDefault();

        await axios.post('http://localhost:8080/api/create_event', {
            name: state.name,
            type: state.type,
            description: state.description,
            location: state.location,
            date: state.date,
            time: state.time,
            limit: state.limit,
            visibility: state.visibility
        })
        .then(res => {
            if(res.status === 200){
                setCreatedMessage("Event has been created!");
            }
        })
    }

    return (
        <div>
            <Header />

            <div className="card col-12 col-lg-4 mt-2">
            <a class="h5">
                    Enter event details:
            </a>
            <form>
                {createdMessage && <div className="createdMessage"> {createdMessage} </div>}
                <label>
                    Event Name:
                    <br />
                    <input id="name"  placeholder="Enter event name" value={state.name} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Event Type:
                    <br />
                    <input id="type"  placeholder="Enter type" value={state.type} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Description:
                    <br />
                    <input id="description" placeholder="Event description" value={state.description} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Location:
                    <br />
                    <input id="location"  placeholder="Event Location" value={state.location} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Date:
                    <br />
                    <input id="date"  placeholder="Enter date" value={state.date} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Time:
                    <br />
                    <input id="time"  placeholder="Enter time" value={state.time} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Attendees Limit:
                    <br />
                    <input id="limit" placeholder="Enter number of attendees allowed" value={state.limit} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Visibility:
                    <br />
                    <input id="visibility"  placeholder="Visibility Type" value={state.visibility} onChange={handleChange} />
                </label>
                <br />
            </form>
            </div>
            <button onClick={handleSubmit} className="registerButton"> Create </button>
         </div>

    )
}

export default CreateEvent 