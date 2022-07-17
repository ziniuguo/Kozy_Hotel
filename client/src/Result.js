import React from "react";
import {Link} from "react-router-dom";
import qs from 'query-string';
import {Autocomplete, TextField} from "@mui/material";

const socket = new WebSocket('ws://localhost:5000')


class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            destinations: [
                // 'Singapore',
                // 'Malaysia',
                // 'Thailand'
            ],
            // term, uid, lat, lng, type, state
            searchData: [],
            searchDataLoaded: false,
            queryParams: {q: "", page: 1, loc: "Singapore%2C+Singapore", locID: "RsBU"},
            pageNo: 1,
            locValue: "",
            locID: "",
            locInputValue: ""
        }
    }

    componentDidMount() {
        socket.onmessage = async ev => {
            console.log(JSON.parse(ev.data).length)
            await this.setState({
                destinations: JSON.parse(ev.data),
            })
            console.log("set success")
        }
        // check params
        if (window.location.search) {
            this.setState({
                queryParams: qs.parse(window.location.search),
                locValue: qs.parse(window.location.search).loc,
                locID: qs.parse(window.location.search).locID
            });
            fetch("/search" + window.location.search)
                .then(response => response.json())
                .then((json) => {
                        this.setState({
                            searchData: json.slice(0, -1),
                            searchDataLoaded: true,
                            pageNo: json.pop()
                        })
                    }
                )
        }
    };

    PageBtn(i) {
        if (Object.hasOwnProperty.bind(this.state.queryParams)('q') &&
            Object.hasOwnProperty.bind(this.state.queryParams)('page')) {
            if (i === 1) {
                return ('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) + 1) + "&loc=" + this.state.queryParams.loc + "&locID=" + this.state.queryParams.locID);
            } else {
                return ('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) - 1) + "&loc=" + this.state.queryParams.loc + "&locID=" + this.state.queryParams.locID);
            }
        } else {
            return window.location.search;
        }
    }

    handleSocketSend(ws, msg) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg)
        } else {
            ws.addEventListener('open', () => this.handleSocketSend(ws, msg))
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Link to="/">back to main</Link>
                </div>
                <div>
                    <form id={"locForm"}>
                        <input style={{display: 'none'}} type="text" defaultValue={this.state.queryParams.q} name="q"/>
                        <input style={{display: 'none'}} type="text" defaultValue={this.state.queryParams.page}
                               name="page"/>
                        <input readOnly={true} style={{display: 'none'}} type="text"
                               value={this.state.locValue} name="loc"/>
                        <input readOnly={true} style={{display: 'none'}} type="text"
                               value={this.state.locID} name="locID"/>
                    </form>
                    <Autocomplete
                        loading={true}
                        loadingText={"There is nothing..."}
                        filterOptions={(x) => x}
                        options={this.state.destinations}
                        sx={{width: 300}}
                        value={this.state.locValue}
                        inputValue={this.state.locInputValue}
                        // below need to be async because can only setState then fetch or submit form
                        onInputChange={async (event, newInputValue) => {
                            await this.setState({locInputValue: newInputValue});
                            if (this.state.locInputValue.length >= 3) {

                                // don't forget to change this localhost:5000 if implement irl...
                                console.log("asking for destination JSON");
                                this.handleSocketSend(socket, newInputValue);
                            }
                        }}
                        onChange={async (event: any, newValue: string | null) => {
                            await this.setState({
                                locValue: (newValue) ? newValue["label"] : "",
                                locID: (newValue) ? newValue["id"] : ""
                            });
                            if (!(this.state.locValue === "")) {
                                document.getElementById("locForm").submit();
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="You are visiting: "/>}
                    />

                </div>
                <div>
                    <h2>search</h2>
                </div>
                <form>
                    <label>
                        Search:
                        <input type="text" defaultValue={this.state.queryParams.q} name="q"/>
                        <input style={{display: 'none'}} type="text" defaultValue="1" name="page"/>
                        {/*why above is defaultValue and below is value?*/}
                        {/*if you use default value, everytime submit the form it never changes, */}
                        {/*as it is fixed as the initial value in this.state.*/}
                        {/*if you use value, it changes according to the url query params*/}
                        <input readOnly={true} style={{display: 'none'}} type="text" value={this.state.queryParams.loc}
                               name="loc"/>
                        <input readOnly={true} style={{display: 'none'}} type="text" value={this.state.queryParams.locID}
                               name="locID"/>

                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                <p>search result test:</p>
                {(this.state.searchDataLoaded)
                    ?
                    (JSON.stringify(this.state.searchData) === '["empty"]'
                        || JSON.stringify(this.state.searchData) === '["no match"]'
                        || JSON.stringify(this.state.searchData) === '["page_exceeded"]'
                        || JSON.stringify(this.state.searchData) === '["undefined_query_params"]'
                    )
                        ?
                        <p>{this.state.searchData}</p>
                        :
                        // JSON.stringify(this.state.searchData)
                        this.state.searchData.map((hotel, i) =>
                            // <p key={i}>{i}. {hotel}</p>
                            <div key={i}>
                                {/*Each child in a list should have a unique "key" prop.*/}
                                <Link
                                    to={{
                                        pathname: "/hotel/" + {hotel}.hotel // replace by variable,
                                    }}
                                >{hotel}</Link>
                            </div>
                        )
                    : <p></p>
                }
                <div>
                    <p></p>
                    <button
                        disabled={this.state.queryParams.page <= 1}
                        onClick={() => window.open("/search" + this.PageBtn(0), "_self")}>prev page
                    </button>
                    page: {this.state.queryParams.page}/{this.state.pageNo}
                    <button
                        disabled={this.state.queryParams.page >= this.state.pageNo}
                        onClick={() => window.open("/search" + this.PageBtn(1), "_self")}>next page
                    </button>

                </div>
                <div>
                </div>
            </div>
        )
    }
}

export default Result;