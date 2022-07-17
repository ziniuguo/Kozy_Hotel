import React from "react";
import parse from "html-react-parser"
// function NewlineText(props){
//     const text=props.text;
//     return text.split("\n").map(str=><div>{str}</div>);
// }
class RoomDetail extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
            lat:"1.318685",
            lng:"103.847882",
            address:"",
            rating:"",
            description:"",
            amenities:"",
            mapsrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d144307.84416915863!2d103.77665436338572!3d1.3499666076124137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1767b42b8ec9%3A0x400f7acaedaa420!2sSingapore!5e0!3m2!1sen!2ssg!4v1656903566371!5m2!1sen!2ssg",
            details: {
                roomList:[
                    {
                        id:"001",
                        type:"single",
                        price:"1000",

                        
                    },
                    {
                        id:"002",
                        type:"single",
                        price:"1000",
                
                        
                    },
                    {
                        id:"003",
                        type:"single",
                        price:"1000",
            
                        
                    },
                ]
            },
            
        }
    }

    componentDidMount() {
        
        console.log(window.location.pathname)
        fetch(window.location.pathname).then(response => response.json())
        .then((json)=> {
            // let amen = "";
            // for (const item in json[5]) {
            //     if(json[5][item]){
            //         amen+=item+ ", ";
            //     }
            // }
            console.log(json)
            this.setState({
                lat:JSON.stringify(json[0]),
                lng:JSON.stringify(json[1]),
                address:json[2],
                rating:JSON.stringify(json[3]),
                description:json[4],
                // amenities: amen,
                mapsrc: "https://maps.google.com/maps?q="+json[0]+","+json[1]+"&z=15&output=embed",
            })
        })
    }

    render() {
        return (
            <div 
            style={{ height: 100 + 'vh', width: '100%' }}
            >
                
                <iframe
                src={this.state.mapsrc}
                width={600} height={450} style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                </iframe>
                <div>
                    {/*replace %20 and + by space. */}
                    <div><h1>Welcome to {window.location.pathname.split('/').pop().split('%20').join(' ').split('+').join(' ')}</h1></div>
                    <br/>
                    <div><b>Address:</b> {this.state.address}</div>
                    <br/>
                    <div><b>Rating:</b> {this.state.rating}</div>
                    <br/>
                    {/* <NewlineText text={"Description" + this.state.description}/> */}
                    {parse(this.state.description)}
                    <br/>
                    {/* <div>Amenities List:<br></br>{this.state.amenities}</div> */}

                    <div><b>Room list:</b> </div>
                    {this.state.details.roomList.map(room=> (
                        <div key={room.id}>
                            <div>Room ID: {room.id}</div>
                            <div>Room type: {room.type}</div>
                            <div>Room price: {room.price}</div>
                            <div>
                                <button
                                // disabled={}
                                onClick={() => window.open("/booking/"+window.location.pathname.split('/').pop(),"_self")}>Book Now
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
                
                <div>
                    {/* next step: if user input room name manually, retrieve from server, server will respond (404 or have) */}
                </div>
                <div>
                    {/* if user is redirected, just retrieve from server */}
                </div>
            </div>
        )
    }
}

export default RoomDetail;