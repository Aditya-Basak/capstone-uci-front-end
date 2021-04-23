import React from 'react'
import Header from './RegisterHeader'
import {Link} from 'react-router-dom';

function Dashboard(props){


    return (
        <div>
            <Header/>
            <br/>
            <Link to="/" style={{ textDecoration: "none" }}>
                <button color="link" className="registerButton"> Logout </button>
            </Link>
         </div>

    )
}

export default Dashboard;