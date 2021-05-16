import React, {useEffect, useState} from 'react'
import Header from './RegisterHeader'
import moment from 'moment'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {useForm} from "react-hook-form";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function EditUser(props){

    let history = useHistory();
    
    const[state, setState] = useState({
        name: "",
        event_type: "",
        description: "",
        location: "",
        time: 0,
        date_field: "",
        time_field: "",
        limit: "",
        scope: "",
    })
     
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_event",{
            params: {
                user_id: 18,
                event_id: 38
            }
        });

        var date = new Date(result.data.time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(month < 10)
        {
            if(day < 10)
                var d_field = year  + "-0" + month + "-0" + day;
            else
            var d_field = year  + "-0" + month + "-" + day;
        }
        else
        {
            if(day < 10)
                var d_field = year  + "-" + month + "-0" + day;
            else
                var d_field = year  + "-" + month + "-" + day;
        }

        if(hours < 10)
        {
            if(minutes < 10)
                var t_field = "0"+hours  + ":0" + minutes;
            else
                var t_field = "0"+hours  + ":" + minutes;
        }
        else
        {
            if(minutes < 10)
                var t_field = hours  + ":0" + minutes;
            else
                var t_field = hours + ":" + minutes;
        }
        
        
        setState({name: result.data.name,
                event_type: result.data.event_type,
                description: result.data.description,
                location: result.data.location,
                limit: result.data.limit,
                date_field: d_field,
                time_field: t_field,
                scope:result.data.scope});
    },[]);

    const[editedMessage, setEditedMessage] = useState('');

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
            await axios.put('http://localhost:8080/api/edit_event', {
                name: state.name,
                event_type: state.event_type,
                description: state.description,
                location: state.location,
                time: new Date(state.date_field+"T"+state.time_field).getTime(),
                limit: parseInt(state.limit),
                scope: state.scope
            },
            {
                params:{
                    user_id: props.location.user_id,
                    event_id: props.location.event_id
                }
            })
            .then(res => {
                console.log(res);
                if(res.status === 200){
                    setEditedMessage("Event has been edited!");
                    history.push({
                        pathname:  '/event',
                        componentProps: {
                          event_id: props.location.event_id,
                          user_id: props.location.user_id
                        }
                    })
                }
            })
            .catch(error => {
                alert("Something went wrong. Retry modifying.\n"+error);
                window.location = "/editUser";
            });
        }
    }
    return (
        
        <div>
            <Header />

            <div className="card col-12 col-lg-4 mt-2">
            <form>
                {editedMessage && <div className="editedMessage"> {editedMessage} </div>}
                <label>
                    <h4>{state.name}</h4>
                </label>
                <br />
                <label>
                    Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="description" placeholder="Event description" value={state.description} onChange={handleChange} disabled />
                </label>
                <br />

                <label>
                    Password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="location"  type="password" placeholder="Password" value={state.location} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={handleSubmit} className="editButton"> Edit </button>
                </label>
                <br />
                <label>
                    Phone Number:&nbsp;&nbsp;
                    <input id="location"  placeholder="Event Location" value={state.location} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={handleSubmit} className="editButton"> Edit </button>
                </label>
            </form>
            </div>
            <button onClick={handleSubmit} className="registerButton"> Modify </button>
         </div>

    )
}

export default EditUser 