import React from "react";

class RoomDetail extends React.Component {

    render() {
        return (
            <div>
                <div>Welcome to detail page</div>
                <div>
                    {/*replace %20 and + by space. */}
                    you are visiting the room detail of {window.location.pathname.split('/').pop().split('%20').join(' ')}
                </div>
                <div>
                    <button
                    // disabled={}
                    onClick={() => window.open("/booking/"+window.location.pathname.split('/').pop(),"_self")}>Book now!
                    </button>
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