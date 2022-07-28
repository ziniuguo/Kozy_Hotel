import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Profile extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/profile/login">Login</Link></li>
                    <li><Link to="/profile/manage">Manage</Link></li>
                </ul>
            </div>
        );
    }
}


export default Profile;