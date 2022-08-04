import React from "react";

class NotFound extends React.Component{
    constructor(props) {
        super(props);
        //Set default message
    }

    render() {
        return (
            <div>
                <h1>404 Not Found</h1>
            </div>
        );
    }
}

export default NotFound;