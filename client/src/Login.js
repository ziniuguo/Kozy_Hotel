import React from "react";
import {Navigate} from 'react-router-dom';
import {Button} from "reactstrap";
import Form from 'react-bootstrap/Form';

class Login extends React.Component {
    constructor() {
        super();
        //Set default message
        this.state = {
            email: '',
            password: '',
            nav: false,
            btnDisabled: false,
            countdown: 0,
        }
    }

    componentDidMount() {

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
            } else if (res.status === 401) {
                window.alert('Incorrect email or password, please try again.')
            } else {
                throw new Error(res.error);
            }
        }).catch(err => {
            console.log(err);
            window.alert('Error logging in, please try again later.')
        })
    }

    handleOTP() {
        this.setState({btnDisabled: true})
        fetch('/OTP', {
            method: 'POST',
            body: JSON.stringify({email: this.state.email}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                window.alert('OTP sent.');
            } else {
                throw new Error(res.error);
            }
            this.setState({countdown: 30})
            setTimeout(function () {
                this.setState({btnDisabled: false})
            }.bind(this), 30000)
            const interval = setInterval(function () {
                if (this.state.countdown === 0) {
                    clearInterval(interval);
                } else {
                    const temp = this.state.countdown;
                    this.setState({
                        countdown: temp - 1
                    })
                }
            }.bind(this), 1000);
        }).catch(err => {
            console.log(err);
            window.alert('Error sending OTP, please try again later.')
        })
    }


    render() {
        return (
            <div style={{backgroundColor: "#F2F8FE"}}>
                <div className="border d-flex align-items-center justify-content-center" style={{height: 920}}>
                <form onSubmit={this.onSubmit} className="form">
                    {this.state.nav && <Navigate to={"/profile"} replace={true}/>}
                    <h1>Login Below!</h1>
                    <br/>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        required
                    />
                    <br/>
                    <Button
                        // style={{
                        //     "width": "120px"
                        // }}
                        disabled={this.state.btnDisabled}
                        onClick={() => this.handleOTP()}
                    >
                        GetOTP
                        {(this.state.countdown === 0)
                            ? ""
                            : "(" + this.state.countdown + ")"}
                    </Button>
                    <br/>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter OTP"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        required
                    />
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>
                </div>
            </div>
        );
    }
}

export default Login;