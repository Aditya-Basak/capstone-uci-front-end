import React, {useEffect, useState,useRef} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
import ReactStars from "react-rating-stars-component";



function UserProfile(props){

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
    
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
            params: {
                user_id: props.location.componentProps.user_id
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
    },[]);

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
    
    return (
        
        <div>
            <Header user_id= {props.location.componentProps.user_id}/>

            <div className="card col-12 col-lg-4 mt-2">
                {phEditMsg && <div className="editedMessage"> {phEditMsg} </div>}
                {pwdEditMsg && <div className="editedMessage"> {pwdEditMsg} </div>}
                <div>
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
                    <input id="phone"  placeholder="New Number" value={state.phone} onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={handlePhSubmit} className="editButton"> Edit </button>
                </div>
            
            </div>
            {<button onClick={backToDashboard} className="backButton" > Go Back </button>}
            <div className ="card col-12 col-lg-4 mt-2">
                <h4 className='center'>Ratings and Testimonials</h4>
                <br></br>
                <h4>Ratings:</h4>
                <div>
                <h5>Social Rating ({state.total_social_ratings}):</h5>
                    {state.social_rating &&
                <ReactStars
                        count={5}
                        size={25}
                        value={state.social_rating}
                        edit={false}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                />
                    }
                </div>
                 <br></br>
                 {state.event_ratings.map((item) => (
                    (
                        <div>
                    <h5>{item.event_key} Rating ({item.total_ratings}):</h5>
                    
                    <ReactStars
                        count={5}
                        size={25}
                        value={item.rating}
                        edit={false}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                />
                <br></br>
                 </div>
                    )
                 ))}

                 <br></br>
                <h4>Testimonials:</h4>
                {state.reviews && state.reviews.map((item) => (
                    <ul className="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center" key={item.id} >
                                "{item}"
                        </li>
                    </ul>
                    ))}
            </div>
         </div>

    )
}

export default UserProfile