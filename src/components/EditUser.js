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
        email: "",
        password: "",
        phone_number: "",
    })
     
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
            params: {
                user_id: 18
            }
        });
        
        setState({name: result.data.name,
                  email: result.data.email,
                  password: result.data.password,
                  phone_number: result.data.phone_number,});
    },[]);

    const[phEditMsg, setPhEditMsg] = useState('');
    const[pwdEditMsg, setPwdEditMsg] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);

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
            await axios.put('http://localhost:8080/api/edit_user_profile', {
                name: state.name,
                password: state.password,
                phone_number: state.phone_number,
            },
            {
                params:{
                    user_id: 18
                }
            })
            .then(res => {
                if(res.status === 200){
                    setPwdEditMsg("Password successfully changed.");
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
      
       if(state.phone_number == "")
               alert("New Phone Number cannot be empty.");
       
       else{
           await axios.put('http://localhost:8080/api/edit_user_profile', {
               name: state.name,
               password: state.password,
               phone_number: state.phone_number,
           },
           {
               params:{
                   user_id: 18
               }
           })
           .then(res => {
               if(res.status === 200){
                   setPhEditMsg("Password successfully changed.");
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
                {phEditMsg && <div className="editedMessage"> {phEditMsg} </div>}
                {pwdEditMsg && <div className="editedMessage"> {pwdEditMsg} </div>}
                <div>
                    <h4>Placeholder</h4>
                    <h4>{state.name}</h4>
                </div>
                <br />
                <div className="email-container">
                    Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="email" value={state.email} onChange={handleChange} disabled />
                </div>
                <br />
                <div className="pwd-container">
                    Password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input id="password"  type={isRevealPwd ? "text":"password"} placeholder="New Password" value={state.password} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <img title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                    <button onClick={handlePwdSubmit} className="editButton"> Edit </button>  
                </div>
                <br />
                <div className="phone-container">
                    Phone Number:&nbsp;&nbsp;
                    <input id="phone_number"  placeholder="New Number" value={state.phone_number} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={handlePhSubmit} className="editButton"> Edit </button>
                </div>
            
            </div>
            <div className ="card col-12 col-lg-4 mt-2">
                <h4 className='center'>Ratings and Testimonials</h4>
                <div>Ratings</div>
                <div>Testimonials</div>
            </div>
         </div>

    )
}

export default EditUser 