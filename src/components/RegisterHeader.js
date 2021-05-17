import React from 'react'

class RegisterHeader extends React.Component{

    render() {
        return(
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="h3" href="/">
                        SportsCon
                    </a>
                <div class='user-profile'>
                    <a class="h3" href="/editUser">
                        User Profile
                    </a>
                </div>
            </nav>

        );
    }
}

export default RegisterHeader