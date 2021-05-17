import React, {useEffect, useState,useRef} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';



function EditUser(props){

    let history = useHistory();
    
    const[state, setState] = useState({
        name: "",
        description: "",
        location: "",
    })
     
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_event",{
            params: {
                user_id: 18,
                event_id: 38
            }
        });
        
        setState({name: result.data.name,
                description: result.data.description,
                location: result.data.location,});
    },[]);

    const[editedMessage, setEditedMessage] = useState('');
    const[phEditMsg, setPhEditMsg] = useState('');
    const[pwdEditMsg, setPwdEditMsg] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        });
      //  console.log(event.target.value); 
    }

    async function handleSubmit (event){
         event.preventDefault();
    
        
        if(state.name == "" || 
            state.description == "" ||
            state.location == "")
                alert("All the fields are REQUIRED.");
        
        else{
            await axios.put('http://localhost:8080/api/edit_event', {
                name: state.name,
                description: state.description,
                location: state.location,
            },
            {
                params:{
                    user_id: 18,
                    event_id: 38
                }
            })
            .then(res => {
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
                {editedMessage && <div className="editedMessage"> {editedMessage} </div>}
                {phEditMsg && <div className="editedMessage"> {phEditMsg} </div>}
                {pwdEditMsg && <div className="editedMessage"> {pwdEditMsg} </div>}
                <div>
                    <h4>{state.name}</h4>
                </div>
                <br />
                <div className="email-container">
                    Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="description" placeholder="Event description" value={state.description} onChange={handleChange} disabled />
                </div>
                <br />
                <div className="pwd-container">
                    Password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="location"  type={isRevealPwd ? "text":"password"} placeholder="Password" value={state.location} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <img title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                    <button onClick={handleSubmit} className="editButton"> Edit TODO:pwdEditMsg  </button>  
                </div>
                <br />
                <div className="phone-container">
                    Phone Number:&nbsp;&nbsp;
                    <input id="location"  placeholder="Event Location" value={state.location} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={handleSubmit} className="editButton"> Edit TODO:phEditMsg </button>
                </div>
            
            </div>
            <button onClick={handleSubmit} className="registerButton"> Modify </button>
         </div>

    )
}

export default EditUser 