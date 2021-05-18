import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom';

function RegisterHeader(props){

    const[state, setState] = useState({
        name: "",
        user_id: props.user_id,
    })
    
    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
            params: {
                user_id: props.user_id
            }
        });
        
        setState({name: result.data.account_details.name,
                    user_id: result.data.account_details.user_id,});
    },[]);
        return(
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="h3" href="/">
                        SportsCon
                    </a>
                <div class='user-profile'>
                    <Link to={{pathname: '/editUser',
                                    componentProps: {
                                        user_id: props.user_id
                                    }}} style={{ textDecoration: "none" }}>
                        <h4>{state.name}</h4>
                        </Link>
                </div>
            </nav>

        );
}

export default RegisterHeader