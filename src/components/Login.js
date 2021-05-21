import React,{useState} from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom';
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';

function Login(props){

    const[state, setState] = useState({
        email: "",
        password: "",
    })

    const[isRevealPwd, setIsRevealPwd] = useState(false);

    let history = useHistory();

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    async function handleSubmit (event){
        event.preventDefault();

        await axios.get('http://localhost:8080/api/login_user', {
            params: {
            email: state.email,
            password: state.password
            }
        })
        .then(res => {
            if(res.status === 200){
                history.push({
                    pathname:  '/dashboard',
                    user_id: res.data.id
                  })
            }
        })
        .catch(error => {
            alert("Wrong username/password.");
            window.location = "/";
        });
    }
   


    return (
        <div>
            <div><br/><br/></div>
            <div className="card col-12 col-lg-4 mt-2">

                <div><h1 class="center">SportsCon</h1></div>
            <a class="h6 center" >
                    Sports were meant to be played together. <br/>You are just one step away!
                </a>
            <form>
                <div className="email-container">
                    <br/>
                    <input id="email" placeholder="Email" value={state.email} onChange={handleChange} />
                </div>
                <br />
                <div className="pwd-container-login">
                    <input id="password"  type={isRevealPwd ? "text":"password"} placeholder="Password" value={state.password} onChange={handleChange} />
                    <img title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                </div>
                <br />
            </form>
            </div>
            
            <button onClick={handleSubmit} className="registerButton"> Login </button>
            <br />
            <br />

            <Link to="/register" style={{ textDecoration: "none" }}>
                <button color="link" className="registerButton"> Register Now </button>
            </Link>
         </div>

    )
}

export default Login;
