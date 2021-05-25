import React, {useState, useEffect} from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';
import axios from 'axios'

function Search(props){

    const[state, setState] = useState({
        user_id: props.location.user_id,
        event_type: props.location.event_type,
        location: props.location.location
    })

    return (
        <div>
            <Header user_id= {state.user_id}/>
            {state.user_id}
            {state.event_type}
            {state.location}
        </div>

    )

}
export default Search;