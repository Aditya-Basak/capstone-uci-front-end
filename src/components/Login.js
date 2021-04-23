import React,{useState} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';

function Login(props){

    const[state, setState] = useState({
        username: "",
        password: "",
    })
    
    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    function handleSubmit (event){
        {console.log(state.email)}
        {console.log(state.password)}
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
                    <input id="username"  placeholder="Username" value={state.username} onChange={handleChange} />
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