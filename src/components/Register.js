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
        var validPhone = true;
       var i;
       for(i = 0; i < state.phonenumber.length; i++)
       {
           var x = state.phonenumber.charCodeAt(i);
           if(i == 0 && x  == 48)
                validPhone = false;
            else if(x < 48 || x > 57)
                validPhone = false;

        }
        var validEmail = false;
        var check1 = false;
        var check2 = false;
        for(i = 0; i < state.email.length; i++)
        {
            var x = state.email.charCodeAt(i);
            if(x == 64)
                check1 = true;
            if(x  == 46 && check1 == true)
                check2 = true;
        }
        if(check1 == true && check2 == true)
            validEmail = true;

       if(state.phonenumber == "")
               alert("New Phone Number cannot be empty.");
       else if(state.phonenumber.length != 10)
                alert("Phone Number should be numeric, 10 digits, and without any special characters.");
        else if(validPhone == false)
                alert("Phone Number cannot begin with zero or have special characters.");
        else if(validEmail == false)
                alert("Invalid Email ID.");
        else{        
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
                    <input id="password" type="password" placeholder="Enter password" value={state.password} onChange={handleChange} />
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