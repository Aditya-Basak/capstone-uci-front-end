import React, {useState} from 'react'
import Header from './RegisterHeader'
import moment from 'moment'
import axios from 'axios'

function CreateEvent(props){
    const[state, setState] = useState({
        name: "",
        event_type: "",
        description: "",
        location: "",
        date_field: "",
        time_field: "",
        limit: "",
        scope: "",
    })

    const[createdMessage, setCreatedMessage] = useState('');

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
      //  console.log(event.target.value); 
    }

    async function handleSubmit (event){
       // event.preventDefault();
        
        console.log(state.name);
        console.log(state.event_type);
        console.log(state.description);
        console.log(state.location);
        console.log(state.date_field+"T"+state.time_field)
        console.log(new Date(state.date_field+"T"+state.time_field).getTime());
        console.log(state.limit);
        console.log(state.scope);
        
        if(state.name == "" || 
            state.event_type == "" ||
            state.description == "" ||
            state.location == "" ||
            state.date_field == "" ||
            state.time == "" ||
            state.limit == "" ||
            state.scope == "" )
                alert("All the fields are REQUIRED.");
        
        else{
            await axios.post('http://localhost:8080/api/create_event', {
                name: state.name,
                event_type: state.event_type,
                description: state.description,
                location: state.location,
                time: new Date(state.date_field+"T"+state.time_field).getTime(),
                limit: parseInt(state.limit),
                scope: state.scope
            },
            {
                params: {user_id: 9}, 
            })
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    setCreatedMessage("Event has been created!");
                }
            })
            .catch(error => {
                alert("Something went wrong. Retry creating.\n"+error);
                window.location = "/createEvent";
            });
        }
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
                    <input id="name"  placeholder="Enter event name" value={state.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Event Type:&nbsp;&nbsp;
                    <select id="event_type" value={state.event_type} onChange={handleChange}>
                    <option disabled selected value="">Select</option>
                    <option value="Soccer">Soccer</option>
                    <option value="basketball">Basketball</option>
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    </select>
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
                    <input id="date_field"  type= "date" min={moment().format("YYYY-MM-DD")} value={state.date_field} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Time:
                    <br />
                    <input id="time_field"  type= "time" value={state.time_field} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Attendees Limit:
                    <br />
                    <input id="limit" type="number" placeholder="No of slots" min="1" value={state.limit} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Scope:
                    <br/>
                    <input id = "scope" type = "radio" name="secrecy" value="public" onChange={handleChange}/> Public&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id = "scope" type = "radio" name="secrecy" value="private" onChange={handleChange}/> Private
                </label>
                <br />
            </form>
            </div>
            <button onClick={handleSubmit} className="registerButton"> Create </button>
         </div>

    )
}

export default CreateEvent 