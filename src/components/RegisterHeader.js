import React from 'react'

class RegisterHeader extends React.Component{

    render() {
        return(
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="h3" href="/">
                    SportsCon
                </a>
                <a class="h3" href="/editUser">
                &nbsp;&nbsp;&nbsp;&nbsp;User Profile
                </a>
            </nav>

        );
    }
}

export default RegisterHeader