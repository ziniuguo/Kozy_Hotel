import React from "react";
import {Navigate} from 'react-router-dom';

class Login extends React.Component {
    constructor() {
        super();
        //Set default message
        this.state = {
            email: '',
            password: '',
            nav: false,
        }
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    }
    onSubmit = (event) => {
        event.preventDefault();
        fetch('/authenticate', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                this.setState({nav: true})
            } else {
                throw new Error(res.error);
            }
        }).catch(err => {
            console.log(err);
            window.alert('Error logging in, please try again.')
        })
    }


    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    {this.state.nav && <Navigate to={"/profile"} replace={true}/>}
                    <h1>Login Below!</h1>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default Login;