import React from "react";
import errImg from './assets/error-image-generic.png';
import {
    Badge,
    Button,
    Modal,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Input,
    ListGroup,
    ListGroupItem
} from "reactstrap";

class Manage extends React.Component{
    constructor() {
        super();
        //Set default message
        this.state = {
            modal:false,
            message: ['Loading...'],
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
            checckinDates: [],
            checkoutDates:[], 
            addresses:[],
            roomNumbers: [],
        }
    }

    componentDidMount() {
        //GET message from server using fetch api
        fetch('/manage')
            .then(res => {
                if (res.status === 401) {
                    res.text();
                } 
                else{
                    res.json();
                }
            })
            .then(
                (res) => {
                    if (res.status === 401) {
                         this.setState({
                            message: res,
                            login_status:0
                        })
                    }
                    else{
                        this.setState({
                            login_status:1,
                            salutation:res[0]["salutation"],
                            first_name:res[0]["firstName"],
                            last_name:res[0]["lastName"],
                            email:res[0]["emailAddress"],
                            phoneNumber:res[0]["phoneNumber"],
                            billingAddress:res[0]["billingAddress"],
                            creditCardNumber:res[0]["creditCardNumber"],
                            total_number:res.length,
                            
                            id_list:res.map(e=>e["_id"]),
                            imgs:res.map(e=>e["imgUri"]),
                            hotel_names:res.map(e=>e["hotelName"]),
                            checckinDates: res.map(e=>e["checkinDate"]),
                            checkoutDates:res.map(e=>e["checkoutDate"]), 
                            addresses:res.map(e=>e[""]),
                            roomNumbers: res.map(e=>e["guests"]),
                        })
                    } 
                }               
            );
    }

    toggle(){
        let temp = !this.state.modal
        this.setState({
            modal:temp
        })
    }
    render() {
        return (
            <div >
                {
                    (
                        this.state.login_status===0
                    )
                    ?
                    <p>{this.state.message}</p>
                    :
                    <div>
                    <h1>Booking Information</h1>
                    <h2>salutation: this.state.salutation</h2>
                    <h2>First Name: this.state.salutation</h2>
                    <h2>Last_Name: this.state.salutation</h2>
                    <h2>Email: this.state.salutation</h2>
                    <h2>Phone Number: this.state.salutation</h2>
                    <h2>Billing Address: this.state.salutation</h2>
                    <h2>Credit Card Number: this.state.salutation</h2>
                    <h2></h2>  
                    <h2>Booking List: </h2><br/>
                    <div>
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
                                                         style={{"height": "200px", "width": "200px", "objectFit": "cover"}}
                                                         src={this.state.imgs[i]}
                                                         alt={"image of hotel ID " + hotel[0]}
                                                         onError={() => document.getElementById("img" + i).src = errImg}
                                                    />
                                                </div>
                                                <div style={{
                                                    width: "100%"
                                                }}>
                                                    <Card
                                                        style={{
                                                            height: '200px',
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
                                                                {"Checckin Date: " + checckinDates[i]}
                                                                <br/>
                                                                {"Checckout Date: " + checckoutDates[i]}
                                                            </CardSubtitle>
                                                            <CardText>
                                                                {"Address: " + this.state.address[i]}
                                                            </CardText>
                                                            <div>
                                                            <Button color="secondary" onClick={this.toggle}>Delete</Button>
                                                            <Modal isOpen={this.state.modal} toggle={this.toggle} {...args}>
                                                                <ModalHeader toggle={this.toggle}>Confirmation</ModalHeader>
                                                                <ModalBody>
                                                                Are you sure want to cancel this booking?
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                <Button color="danger" onClick={toggle}>Yes</Button>{' '}
                                                                <Button color="primary" onClick={toggle}>No</Button>
                                                                </ModalFooter>
                                                            </Modal>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                )}
                            </ListGroup>            
                    </div>
                    </div>
                }        
            </div>
        );
    }
}

export default Manage;