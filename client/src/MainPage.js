import React from "react";
import {Link} from "react-router-dom";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <div>Welcome to main page</div>
                <div>
                    <Link to="/search">see search page</Link>
                </div>
            </div>

        )
    }
}

export default MainPage;