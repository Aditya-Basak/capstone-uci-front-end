import React, {useState} from 'react'
import Header from './RegisterHeader'

function Register(props){
    const[state, setState] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: "",
    })

    function handleChange (event) {
        setState({
            ...state,
            [event.target.id]: event.target.value
        }); 
    }

    function handleSubmit (event){
        {console.log(state.name)}
        {console.log(state.email)}
        {console.log(state.password)}
        {console.log(state.phonenumber)}
    }

    return (
        <div>
            <Header />

            <div className="card col-12 col-lg-4 mt-2">
            <a class="h5">
                    Enter your details:
                </a>
            <form>
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