import React, { Component } from 'react';
import { Button} from 'react-bootstrap';
import background from "./assets/0.jpg";


class Profile extends Component {
    render() {
        return (
            <div style={
                // {backgroundColor: "#F2F8FE"}
                { 
                backgroundImage: `url(${background})`, 
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover' ,
                minHeight:'100vh'
                }
            }
            >
                <div className="border d-flex align-items-center justify-content-center" style={{height: 920}}>
                <form className="form">
                    <h3>Login to manage your account</h3>
                    <br/>
                    <br/>
                    <Button type="button" className="btn btn-primary btn-lg"
                        onClick={() => window.open("/profile/login", "_self")}>Login
                    </Button>
                    <br/>
                    
                    <br/>
                    <p>Login already?</p>
                    <Button type="button" className="btn btn-primary btn-lg"
                        onClick={() => window.open("/profile/manage","_self")}>Manage
                    </Button>
                </form>
                
                </div>
            </div>
        );
    }
}


export default Profile;