import React, {useState} from 'react'
import Header from './RegisterHeader'
import moment from 'moment'
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
      //  console.log(event.target.value); 
    }

    async function handleSubmit (event){
       // event.preventDefault();
        
        console.log(state.name);
        console.log(state.type);
        console.log(state.description);
        console.log(state.location);
        console.log(new Date(state.date.split("-")).getTime() / 1000);
        console.log(new Date(state.time.split(":")).getTime() / 1000);
        console.log(state.limit);
        console.log(state.visibility);
        
        if(state.name == "" || 
            state.type == "" ||
            state.description == "" ||
            state.location == "" ||
            state.date == "" ||
            state.time == "" ||
            state.limit == "" ||
            state.visibility == "" )
                alert("All the fields are REQUIRED.");
        
        else{
            await axios.post('http://localhost:8080/api/create_event', {
                name: state.name,
                type: state.type,
                description: state.description,
                location: state.location,
                date: new Date(state.date.split("-")).getTime() / 1000,
                time: new Date(state.time.split(":")).getTime() / 1000,
                limit: state.limit,
                visibility: state.visibility
            })
            .then(res => {
                if(res.status === 200){
                    setCreatedMessage("Event has been created!");
                }
            })
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
                    <select id="type" value={state.type} onChange={handleChange}>
                    <option disabled selected value="">Select</option>
                    <option value="soccer">Soccer</option>
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
                    <input id="date"  type= "date" min={moment().format("YYYY-MM-DD")} value={state.date} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Time:
                    <br />
                    <input id="time"  type= "time" value={state.time} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Attendees Limit:
                    <br />
                    <input id="limit" type="number" placeholder="No of slots" min="1" value={state.limit} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Visibility:
                    <br/>
                    <input id = "visibility" type = "radio" name="secrecy" value="public" onChange={handleChange}/> Public&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id = "visibility" type = "radio" name="secrecy" value="private" onChange={handleChange}/> Private
                </label>
                <br />
            </form>
            </div>
            <button onClick={handleSubmit} className="registerButton"> Create </button>
         </div>

    )
}

export default CreateEvent 