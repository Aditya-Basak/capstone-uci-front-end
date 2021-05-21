import React, {useState} from 'react'
import axios from 'axios'
import showPwdImg from '../show-password.svg';
import hidePwdImg from '../hide-password.svg';
function Register(props){
    const[state, setState] = useState({
        name: "",
        email: "",
        password: "",
        phonenumber: "",
    })

    const[registeredMessage, setRegisteredMessage] = useState('');
    const[isRevealPwd, setIsRevealPwd] = useState(false);

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
        else if(state.name == "" || state.email == "" || state.password == "" || state.phone == "")
                    alert("All the fields are REQUIRED.");        
        else{        
            await axios.post('http://localhost:8080/api/register_user', {
                name: state.name,
                email: state.email,
                password: state.password,
                phone: state.phonenumber
            
            })
            .then(res => {
                if(res.status === 200){
                    setRegisteredMessage(state.name + " has been registered!");
                    document.getElementById("myBtn").disabled = true;
                }
            })
        }
    }

    return (
        <div>
            <div><br/><br/></div>
            <div className="card col-12 col-lg-4 mt-2">
            <div><h1 class="center">SportsCon</h1></div>
            <a class="h5 center">
                    Enter your details to hop on board!<br/><br/>
            </a>
            <form>
                {registeredMessage && <div className="registeredMessage"> {registeredMessage} </div>}
                <div className="email-container">
                    Name:
                    <br />
                    <input id="name"  placeholder="Enter name" value={state.name} onChange={handleChange} />
                </div>
                <br />
                <div className="email-container">
                    Email:
                    <br />
                    <input id="email" placeholder="Enter email" value={state.email} onChange={handleChange} />
                </div>
                <br />
                <div className="pwd-container-register">
                    Password:
                    <br />
                    <input id="password"  type={isRevealPwd ? "text":"password"} placeholder="Enter Password" value={state.password} onChange={handleChange} />
                    <img title={isRevealPwd ? "Hide Password":"Show Password"} src={isRevealPwd? hidePwdImg: showPwdImg} onClick={() => setIsRevealPwd(prevState  =>  !prevState)}/>
                </div>
                <br />
                <div className="phone-container">
                    Phone Number:
                    <br />
                    <input id="phonenumber" placeholder="Enter number" value={state.phonenumber} onChange={handleChange} />
                </div>
                <br/>
                <br />
            </form>
            </div>
            <button id="myBtn" onClick={handleSubmit} className="registerButton"> Register </button>
         </div>

    )
}

export default Register