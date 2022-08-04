import React from "react";
import errImg from './assets/error-image-generic.png';
import background from "./assets/0.jpg";
import {
    Badge,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Input,
    ListGroup,
    ListGroupItem
} from "reactstrap";


function getGuestRoom(guestsParam) {
    let ls = guestsParam.split('|');
    let result = [0, 0, 0, 0];
    for (let i = 0; i < ls.length; i++) {
        let curr = ls[i];
        switch (curr) {
            case "1" :
                result[0] += 1;
                break;
            case "2":
                result[1] += 1;
                break;
            case "3":
                result[2] += 1;
                break;
            case "4":
                result[3] += 1;
                break;
            default:
                break;
        }
    }
    return result;
}

class Manage extends React.Component{
    constructor(props) {
        super(props);
        //Set default message
        this.state = {
            modal:false,
            message: 'Loading...',
            login_status:0,
            //User info
            salutation:"Mr",
            first_name:"Z",
            last_name:"CJ",
            email:"example@gg.com",
            phoneNumber:"123456",
            billingAddress:"xxx",
            creditCardNumber:"xxx",
            total_number:0,
            
            id_list:[],
            imgs:[],
            destinations: [],
            hotel_names:[],
            checkinDates: [],
            checkoutDates:[], 
            addresses:[],
            roomNumbers: [],
        }
    }

    componentDidMount() {
        fetch('/manage')
        .then((res) => {
            if(res.status !== 200) throw new Error(response.status);
            else return res.json();
        })
        .then((json) => {
            console.log('json: ' + json);
            if(Object.keys(json).length !== 0){
                this.setState({
                    login_status:1,
                    message:"showing...",
                    salutation:json[0]["salutation"],
                    first_name:json[0]["firstName"],
                    last_name:json[0]["lastName"],
                    email:json[0]["emailAddress"],
                    phoneNumber:json[0]["phoneNumber"],
                    billingAddress:json[0]["billingAddress"],
                    creditCardNumber:json[0]["creditCardNumber"],
                    total_number:json.length,
                    
                    id_list:json.map(e=>e["_id"]),
                    imgs:json.map(e=>e["imgUri"]),
                    hotel_names:json.map(e=>e["hotelName"]),
                    checkinDates: json.map(e=>e["checkinDate"]),
                    checkoutDates:json.map(e=>e["checkoutDate"]), 
                    addresses:json.map(e=>e["hotelAddress"]),
                    roomNumbers:json.map(e=>e["guests"]),
                })
            }
            else{
                this.setState({
                    message: "No booking information for this account yet"
                })
            }
        })
        .catch((error) => {
            this.setState({
                message: "You need to login first"
            })
            console.log('error: ' + error);
            this.setState({ requestFailed: true });
        });
    }

    handleDelete(delete_id){
        fetch('/cancelBooking', {
            method: 'POST',
            body: JSON.stringify({bookingID: delete_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                window.alert('Delete successfully.');
                location.reload();
            } else {
                throw new Error(res.error);
            }
        }).catch(err => {
            console.log(err);
            window.alert('Error deleting booking, please try again later.')
            location.reload();
        })
    }

    toggle(){
        let temp = !this.state.modal
        this.setState({
            modal:temp
        })
    }
    render() {
        return (
            <div className="border d-flex align-items-center justify-content-center" 
            style={{ 
                backgroundImage: `url(${background})`, 
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover' ,
                minHeight:'100vh'
            }}>
                {
                    (
                        this.state.login_status===0
                    )
                    ?
                    <p>{this.state.message}</p>
                    :
                    (this.state.message==="Loading...")
                    ?
                    <p>No booking information yet.</p>
                    :
                    <div>
                    <br/>
                    <Card style={{height: '230px', width: '86.5rem', padding:20}} className="boxShadow">
                    <CardTitle tag="h5">
                        Booking Information
                    </CardTitle>
                    <CardText
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                    Salutation: {this.state.salutation}
                    <br/>
                    First Name: {this.state.first_name}
                    <br/>
                    Last_Name: {this.state.last_name}
                    <br/>
                    Email: {this.state.email}
                    <br/>
                    Phone Number: {this.state.phoneNumber}
                    <br/>
                    Billing Address: {this.state.billingAddress}
                    <br/>
                    Credit Card Number: {this.state.creditCardNumber}
                    <br/>
                    </CardText>
                    </Card>
                    <div>
                    <br/>
                        <ListGroup className="centerLoc">
                                {this.state.id_list.map((id, i) =>
                                    <ListGroupItem key={i} className="boxShadow">
                                        <div>
                                            <div
                                                style={{
                                                    "display": "flex",
                                                    "alignItems": "center",
                                                    "justifyContent": "center",
                                                    "flexDirection": "row",
                                                    "width": "100%"
                                                }}
                                            >
                                                <div style={{"textAlign": "left"}}>
                                                    <img id={"img" + i}
                                                         style={{"height": "230px", "width": "230px", "objectFit": "cover"}}
                                                         src={this.state.imgs[i]}
                                                         alt={"image of hotel ID " + this.state.hotel_names[i]}
                                                         onError={() => document.getElementById("img" + i).src = errImg}
                                                    />
                                                </div>
                                                <div style={{
                                                    width: "100%"
                                                }}>
                                                    <Card
                                                        style={{
                                                            height: '230px',
                                                            width: '70rem'
                                                        }}
                                                    >
                                                        <CardBody>
                                                            <CardTitle tag="h5">
                                                                {this.state.hotel_names[i]}
                                                            </CardTitle>
                                                            <CardSubtitle
                                                                className="mb-2 text-muted"
                                                                tag="h6"
                                                            >
                                                                {"Checkin Date: " + this.state.checkinDates[i]}
                                                                <br/>
                                                                {"Checkout Date: " + this.state.checkoutDates[i]}
                                                            </CardSubtitle>
                                                            <CardText>
                                                    
                                                                <label>Room booking list: <br/>
                                                                    Single: {getGuestRoom(this.state.roomNumbers[i])[0]}{' '}
                                                                    Double: {getGuestRoom(this.state.roomNumbers[i])[1]}{' '}   
                                                                    Suite: {getGuestRoom(this.state.roomNumbers[i])[2]}{' '}
                                                                    Executive Suite: {getGuestRoom(this.state.roomNumbers[i])[3]}
                                                                </label>
                                                    
                                                                <br/>
                                                                {"Address: " + this.state.addresses[i]}
                                                            </CardText>
                                                            <div>

                                                            <Button
                                                                onClick={() => {
                                                                    if (window.confirm("Are you sure want to cancel this booking?")) {
                                                                        this.handleDelete(id);
                                                                        // location.reload();
                                                                    }
                                                                }}>
                                                            Delete
                                                            </Button>

                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                )}
                            </ListGroup> 
                            <br/>           
                    </div>
                    </div>
                }        
            </div>
        );
    }
}

export default Manage;