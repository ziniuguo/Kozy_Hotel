import React from "react";

class RoomDetail extends React.Component {

    render() {
        return (
            <div>
                <div>Welcome to detail page</div>
                <div>
                    {/*replace %20 and + by space. */}
                    you are visiting the room detail of {location.pathname.split('%20').join(' ').split('+').join(' ')}
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