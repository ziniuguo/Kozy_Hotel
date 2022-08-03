import React from "react";
import errImg from './assets/error-image-generic.png';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Input,
    ListGroup,
    ListGroupItem
} from "reactstrap";
import Ratings from "react-ratings-declarative/build/ratings";

class Manage extends React.Component{
    constructor() {
        super();
        //Set default message
        this.state = {
            message: ['Loading...']
        }
    }
    componentDidMount() {
        //GET message from server using fetch api
        fetch('/manage')
            .then(res => res.text())
            .then(res => this.setState({message: res}));
    }
    render() {
        return (
            <div>
                <h1>List: </h1><br/>
                <p>{this.state.message}</p>
                <div>
                    <ListGroup className="centerLoc">
                            {/* {this.state.message.map((hotel, i) =>
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
                                                     src={hotel[4]}
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
                                                            {hotel[1]}
                                                        </CardTitle>
                                                        <CardSubtitle
                                                            className="mb-2 text-muted"
                                                            tag="h6"
                                                        >
                                                            {"S$: " + hotel[2]}
                                                            <br/>
                                                            <Ratings
                                                                widgetDimensions="20px"
                                                                widgetSpacings="0px"
                                                                rating={hotel[5]}
                                                                // widgetRatedColors="blue"
                                                            >
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                            </Ratings>
                                                        </CardSubtitle>
                                                        <CardText>
                                                            {"Address: " + hotel[3]}
                                                        </CardText>
                                                        <Button href={"hotel/" + hotel[0]}
                                                                onClick={() => this.getBookingInfo()}>
                                                            Book
                                                        </Button>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroupItem>
                            )} */}
                        </ListGroup>            
                </div>
            </div>
        );
    }
}

export default Manage;