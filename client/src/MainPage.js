import React from "react";
import './assets/style.css'

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

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
                        <button id={"mainPageBtn"}
                                onClick={() => window.open("/search?q=&page=1&loc=Singapore%2C+Singapore&locID=RsBU&checkin=" +
                                    formatDate(new Date()) +
                                    "&checkout=" +
                                    formatDate(new Date((new Date()).valueOf() + 1000 * 3600 * 24)) +
                                    "&guests=2", "_self")}>
                            Book&nbsp;Now
                        </button>


                    </div>
                </div>
            </div>

        )
    }
}

export default MainPage;