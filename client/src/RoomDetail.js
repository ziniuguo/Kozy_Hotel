import React from "react";
import parse from "html-react-parser";
import "./RoomDetail.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import coverImg from "./assets/coverImg.jpg";
// import testImg1 from "./assets/test1.jpg" ;
// import testImg2 from "./assets/test2.jpg" 
// import testImg3 from "./assets/EVA.jfif" 
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

class RoomDetail extends React.Component {
    imageGenerator(imgPrefix,noOfImg){
        let result =[];
        for(let i=1;i<=noOfImg;i++){
            result.push(imgPrefix+String(i)+".jpg");
        }
        return result;
    }
    state = {
        display: true,
        width: 200,
        height:200,
    };
    
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            lat:"1.318685",
            lng:"103.847882",
            address:"",
            rating:"",
            description:"",
            imgPrefix:"",
            noOfImg:0,
            images:[],
            mapsrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d144307.84416915863!2d103.77665436338572!3d1.3499666076124137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1767b42b8ec9%3A0x400f7acaedaa420!2sSingapore!5e0!3m2!1sen!2ssg!4v1656903566371!5m2!1sen!2ssg",
            details: {
                roomList:[
                    {
                        level:"",
                        type:"Single",
                        price:"500",

                    },
                    {
                        id:"002",
                        type:"Double",
                        price:"800",
                                    
                    },
                    {
                        id:"003",
                        type:"Suite",
                        price:"1200",
            
                    },
                    {
                        id:"004",
                        type:"Executive Suite",
                        price:"2000",
            
                    },
                ]
            },
            
        }
    }

    componentDidMount() {
        
        console.log(window.location.pathname)
        fetch(window.location.pathname).then(response => response.json())
        .then((json)=> {
            console.log(json)
            this.setState({
                name:json[0],
                lat:JSON.stringify(json[1]),
                lng:JSON.stringify(json[2]),
                address:json[3],
                rating:JSON.stringify(json[4]),
                description:json[5],
                // amenities: amen,
                imgPrefix:json[6],
                noOfImg:json[7],
                images:this.imageGenerator(this.state.imgPrefix,this.state.noOfImg),
                mapsrc:"https://maps.google.com/maps?q="+json[1]+","+json[2]+"&z=15&output=embed",
            })
        })
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            fade: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            avariableWidth: true,
        };
        return (
                <div className="centerLoc" 
                    style={{
                    backgroundColor: "#F2F8FE",
                    }}
                >
                    <Card style={{ width: '100rem' }}>
                    <div className="ImgContainer">
                        <Slider {...settings}>
                            {this.state.images.map(image=>(
                                <div className="center-image">
                                    <h3><img className = "Cover" style={{"height": "600px", "width": "1000px", }} src={image} alt="test"/></h3>
                                    </div>
                            ))}
                        </Slider>
                    </div>
                    <Card.Body>
                        <Card.Title>
                            <br/>
                            <br/>
                            <div className="centerLoc">
                            <p style={{fontSize:50}}>Welcome to {this.state.name}</p>
                            </div>
                            <br/>
                            <br/>
                            <br/>
                    
                        </Card.Title>
                        <Card.Text>
                        <div className="float-container">
                            
                            <div className="Info" >
                            {/*replace %20 and + by space. */}
                            <br/>
                            <p style={{fontSize:18}}>
                            <div><b>Address:</b> {this.state.address}</div>
                            <br/>
                            <div><b>Rating:</b> {this.state.rating}</div>
                            <br/>
                            {/* <NewlineText text={"Description" + this.state.description}/> */}
                            {parse(this.state.description)}
                            <br/>
                            {/* <div>Amenities List:<br></br>{this.state.amenities}</div> */}
                            </p>
                            </div> 
                            
                            <div  className="Map">
                            <div><h3>Location on Google Map</h3></div>
                            <iframe
                            src={this.state.mapsrc}
                            height={450} style={{ width: '100%',border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                            </div>
                        </div>
                        </Card.Text>
                    </Card.Body>
                    <div className="roomBooking">
                    <Card>
                    <Card.Body>
                            <div><b>Room list:</b><br/> </div>
                            <div >
                            <ListGroup className="list-group-flush">
                            {this.state.details.roomList.map(room=> (
                                <ListGroup.Item>
                                <div key={room.id}>
                                    <div>Room type: {room.type}</div>
                                    <div>Room price: {room.price}</div>
                                    <div>
                                        <button className = "btn-custom"
                                        // disabled={}
                                        onClick={() => window.open("/booking/"+window.location.pathname.split('/').pop(),"_self")}>Book Now
                                        </button>
                                    </div>
                                </div>
                                </ListGroup.Item>
                            ))}
                            </ListGroup>
                            </div>
                    </Card.Body>
                    </Card>
                    </div>
                    <Card.Body>
                    <div className="centerLoc">
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                    </div>
                    </Card.Body>
                    </Card>
                    <br/>
                    
            </div>


                // {/**/}
        )
    }
}

export default RoomDetail;