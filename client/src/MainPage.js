import React from "react";
import {Link} from "react-router-dom";
import './assets/style.css'

class MainPage extends React.Component {

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