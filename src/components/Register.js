import React, {useState} from 'react'
import Header from './RegisterHeader'
import axios from 'axios'

function Register(props){
    const[state, setState] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: "",
    })

    const[registeredMessage, setRegisteredMessage] = useState('');

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    async function handleSubmit (event){
        event.preventDefault();

        await axios.post('http://localhost:8080/api/register_user', {
            name: state.name,
            email: state.email,
            password: state.password,
            phone: state.phonenumber
        
        })
        .then(res => {
            if(res.status === 200){
                setRegisteredMessage("User has been registered!");
            }
        })
    }

    return (
        <div>
            <Header />

            <div className="card col-12 col-lg-4 mt-2">
            <a class="h5">
                    Enter your details:
            </a>
            <form>
                {registeredMessage && <div className="registeredMessage"> {registeredMessage} </div>}
                <label>
                    Name:
                    <br />
                    <input id="name"  placeholder="Enter name" value={state.name} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Email:
                    <br />
                    <input id="email" placeholder="Enter email" value={state.email} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Password:
                    <br />
                    <input id="password" placeholder="Enter password" value={state.password} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Phone Number:
                    <br />
                    <input id="phonenumber" placeholder="Enter number" value={state.phonenumber} onChange={handleChange} />
                </label>
                <br />
            </form>
            </div>
            <button onClick={handleSubmit} className="registerButton"> Register </button>
         </div>

    )
}

export default Register