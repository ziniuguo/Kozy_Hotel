import React from "react";

class RoomDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            lat:"1.318685",
            lng:"103.847882",
        }
    }

    componentDidMount() {
        this.setState({
            mapsrc: "https://maps.google.com/maps?q="+this.state.lat+","+this.state.lng+"&z=15&output=embed"
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

                <div><h1>Welcome to detail page</h1></div>
                <div>
                    {/*replace %20 and + by space. */}
                    You are visiting the room detail of {window.location.pathname.split('/').pop().split('%20').join(' ')}
                    {this.state.details.roomList.map(room=> (
                        <div className="list-room" key={room.id}>
                            <div className="id">Room ID: {room.id}</div>
                            <div className="type">Room type: {room.type}</div>
                            <div className="price">Room price: {room.price}</div>
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
                    next step: if user input room name manually, retrieve from server, server will respond (404 or have)
                </div>
                <div>
                    if user is redirected, just retrieve from server
                </div>
            </div>
        )
    }
}

export default RoomDetail;