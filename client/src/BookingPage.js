import React from "react";
import qs from 'query-string';

class BookingPage extends React.Component {


    render() {
        return (
            <div>
                <div>Welcome to detail page</div>
                <div>
                    {/*replace %20 and + by space. */}
                    you are visiting the room detail of {location.pathname.split('/').pop().split('%20').join(' ')}
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

export default BookingPage;