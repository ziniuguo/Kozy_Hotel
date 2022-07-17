import React from "react";
import {Link} from "react-router-dom";
import './assets/style.css'

class MainPage extends React.Component {

    render() {
        return (
            <div id={"mainPage"}>
                <div id={"welcome"}>
                    <div id={"welcomeBlock"}>
                        <div>
                            Welcome&nbsp;to Ascenda&nbsp;Loyalty
                        </div>
                        <div id={"welcomeDesc"}>
                            Book for your travel anywhere
                        </div>
                        <Link to="/search?q=&page=1&loc=Singapore%2C+Singapore&locID=RsBU">
                            <button id={"mainPageBtn"}>
                                Book&nbsp;Now
                            </button>
                        </Link>
                    </div>
                </div>
                <div>
                    About us: we are something something
                </div>

            </div>

        )
    }
}

export default MainPage;