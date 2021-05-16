import React,{useState} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom';

function Login(props){

    const[state, setState] = useState({
        email: "",
        password: "",
    })

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
            <Header/>
            <div className="card col-12 col-lg-4 mt-2">
            <a class="h5">
                    Sports were meant to be played together. You are just one step away!
                </a>
            <form>
                <label>
                    <br />
                    <input id="email"  placeholder="email" value={state.email} onChange={handleChange} />
                </label>
                <br />
                <label>
                    <br />
                    <input type="password" id="password" placeholder="Password" value={state.password} onChange={handleChange} />
                </label>
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
