import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom';

function RegisterHeader(props){

    const[state, setState] = useState({
        name: "",
    })

    useEffect(async () => {
        const result = await axios.get("http://localhost:8080/api/get_user_profile",{
            params: {
                user_id: props.user_id
            }
        });
        
        setState({name: result.data.account_details.name,});
    },[]);
        return(
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="h3" href="/">
                        SportsCon
                    </a>
                <div class='user-profile'>
                    <a class="h3" href="/editUser">
                        {state.name}
                    </a>
                </div>
            </nav>

        );
}

export default RegisterHeader