import React from "react";
import qs from 'query-string';
import {Autocomplete, TextField} from "@mui/material";
import errImg from './assets/error-image-generic.png';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Input,
    ListGroup,
    ListGroupItem
} from "reactstrap";
import Ratings from "react-ratings-declarative/build/ratings";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {displayedDate, getGuestRoom, formatDate} from "./GuestRoomConverter";


const socket = new WebSocket('ws://localhost:5000')

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            destinations: [],
            searchData: ["loading..."],
            queryParams: {
                q: "", page: 1, loc: "", locID: "",
                checkin: "", checkout: "", guests: ""
            },
            pageNo: 1,
            locValue: "",
            locID: "",
            locInputValue: "",
            date1: new Date(),
            date2: new Date(),
            guestNo: []
        }
    }

    async componentDidMount() {
        // when socket receives destination data from server
        socket.onmessage = async ev => {
            console.log(JSON.parse(ev.data).length);
            await this.setState({
                destinations: JSON.parse(ev.data),
            });
            console.log("set success");
        }
        // check params
        if (window.location.search) {
            this.setState({
                queryParams: qs.parse(window.location.search),
                locValue: qs.parse(window.location.search).loc,
                locID: qs.parse(window.location.search).locID,
                date1: new Date(qs.parse(window.location.search).checkin.split('-')[0],
                    qs.parse(window.location.search).checkin.split('-')[1] - 1,
                    qs.parse(window.location.search).checkin.split('-')[2]),
                date2: new Date(qs.parse(window.location.search).checkout.split('-')[0],
                    qs.parse(window.location.search).checkout.split('-')[1] - 1,
                    qs.parse(window.location.search).checkout.split('-')[2]),
                guestNo: getGuestRoom(qs.parse(window.location.search).guests),
            });
            fetch("/search" + window.location.search)
                .then(response => response.json())
                .then((json) => {
                        this.setState({
                            searchData: json.slice(0, -1),
                            pageNo: json.pop()
                        })
                    }
                )
        }
    };

    getBookingInfo() {
        localStorage.setItem("destID", this.state.queryParams.locID);
        localStorage.setItem("checkinDate", this.state.queryParams.checkin);
        localStorage.setItem("displayCheckin", displayedDate(this.state.queryParams.checkin));
        localStorage.setItem("checkoutDate", this.state.queryParams.checkout);
        localStorage.setItem("displayCheckout", displayedDate(this.state.queryParams.checkout));
        localStorage.setItem("guestCount", this.state.queryParams.guests);
        console.log(this.state.queryParams)
    }

    PageBtn(i) {
        if (Object.hasOwnProperty.bind(this.state.queryParams)('q') &&
            Object.hasOwnProperty.bind(this.state.queryParams)('page')) {
            if (i === 1) {
                return ('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) + 1)
                    + "&loc=" + this.state.queryParams.loc
                    + "&locID=" + this.state.queryParams.locID
                    + "&checkin=" + this.state.queryParams.checkin
                    + "&checkout=" + this.state.queryParams.checkout
                    + "&guests=" + this.state.queryParams.guests
                );
            } else {
                return ('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) - 1)
                    + "&loc=" + this.state.queryParams.loc
                    + "&locID=" + this.state.queryParams.locID
                    + "&checkin=" + this.state.queryParams.checkin
                    + "&checkout=" + this.state.queryParams.checkout
                    + "&guests=" + this.state.queryParams.guests
                );
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

    handleRoom(roomType, add) {
        let newState = this.state.guestNo;
        // check total room no. <= 4
        let sum = newState.reduce((partialSum, a) => partialSum + a, 0);

        if (add) {
            if (sum >= 4) {
                window.alert("You can only book up to 4 rooms.");
            } else {
                newState[roomType]++;
            }
        } else {
            // check if room no. is 0
            if (newState[roomType] <= 0) {
                window.alert("wtf are you doing??")
            } else {
                newState[roomType]--;
            }
        }
        this.setState({
            guestNo: newState,
        })
    }

    handleRoomSubmit(guestNoList) {
        let retLs = [];
        for (let i = 1; i <= guestNoList[0]; i++) {
            retLs.push("1");
        }
        for (let i = 1; i <= guestNoList[1]; i++) {
            retLs.push("2");
        }
        for (let i = 1; i <= guestNoList[2]; i++) {
            retLs.push("3");
        }
        for (let i = 1; i <= guestNoList[3]; i++) {
            retLs.push("4");
        }
        return retLs.join('|');
    }

    render() {
        return (
            <div style={{backgroundColor: "#F2F8FE"}} >
                <br/>
                <div className="centerLoc">
                    <Card style={{height: '220px', width: '84.5rem'}}>
                        <div className="formStyle">
                            <form id={"locForm"}>
                                <input style={{display: 'none'}} type="text" defaultValue={this.state.queryParams.q}
                                       name="q"/>
                                <input style={{display: 'none'}} type="text" defaultValue={this.state.queryParams.page}
                                       name="page"/>
                                <input readOnly={true} style={{display: 'none'}} type="text"
                                       value={this.state.locValue} name="loc"/>
                                <input readOnly={true} style={{display: 'none'}} type="text"
                                       value={this.state.locID} name="locID"/>
                                <input style={{display: 'none'}} type="text"
                                       defaultValue={this.state.queryParams.checkin}
                                       name={"checkin"}/>
                                <input style={{display: 'none'}} type="text"
                                       defaultValue={this.state.queryParams.checkout}
                                       name={"checkout"}/>
                                <input style={{display: 'none'}} type="text"
                                       defaultValue={this.state.queryParams.guests}
                                       name={"guests"}/>
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
                        <form className="centerLoc" id={"HotelSearchBar"}>
                            <label
                                style={{display: 'none'}} // temporarily remove search by keyword
                            >Search Hotel:</label>
                            <Input
                                style={{display: 'none'}} // temporarily remove search by keyword
                                type="search" defaultValue={this.state.queryParams.q} name="q"/>
                            <input style={{display: 'none'}} type="text" defaultValue="1" name="page"/>
                            <input readOnly={true} style={{display: 'none'}} type="text"
                                   value={this.state.queryParams.loc}
                                   name="loc"/>
                            <input readOnly={true} style={{display: 'none'}} type="text"
                                   value={this.state.queryParams.locID}
                                   name="locID"/>
                            <label>Check-in Date:</label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Check-in Date"
                                    value={this.state.date1}
                                    onChange={(newValue) => {
                                        this.setState({
                                            date1: newValue,
                                        })
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Input readOnly={true} style={{display: 'none'}} type="text"
                                   value={formatDate(this.state.date1)}
                                   name="checkin"/>
                            <label>Check-out Date:</label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Check-out Date"
                                    value={this.state.date2}
                                    onChange={(newValue) => {
                                        this.setState({
                                            date2: newValue,
                                        })
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Input readOnly={true} style={{display: 'none'}} type="text"
                                   value={formatDate(this.state.date2)}
                                   name="checkout"/>
                            <label>Room type:</label>
                            <Input readOnly={true} style={{"display": "none"}} type="text"
                                   value={this.handleRoomSubmit(this.state.guestNo)}
                                   name="guests"/>
                            <div>
                                <div
                                    style={{
                                        "display": "flex",
                                        "flexDirection": "row",
                                        "alignItems": "center",
                                    }}
                                >
                                    Single<Badge
                                    onClick={() => this.handleRoom(0, false)}
                                    style={{"margin": "5px"}} pill>-</Badge>
                                    <div>{this.state.guestNo[0]}</div>
                                    <Badge
                                        onClick={() => this.handleRoom(0, true)}
                                        style={{"margin": "5px"}} pill>+</Badge>
                                </div>
                                <div style={{
                                    "display": "flex",
                                    "flexDirection": "row",
                                    "alignItems": "center"
                                }}>
                                    Double <Badge
                                    onClick={() => this.handleRoom(1, false)}
                                    style={{"margin": "5px"}} pill>-</Badge>
                                    <div>{this.state.guestNo[1]}</div>
                                    <Badge
                                        onClick={() => this.handleRoom(1, true)}
                                        style={{"margin": "5px"}} pill>+</Badge>
                                </div>
                                <div style={{
                                    "display": "flex",
                                    "flexDirection": "row",
                                    "alignItems": "center"
                                }}>
                                    Suite<Badge
                                    onClick={() => this.handleRoom(2, false)}
                                    style={{"margin": "5px"}} pill>-</Badge>
                                    <div>{this.state.guestNo[2]}</div>
                                    <Badge
                                        onClick={() => this.handleRoom(2, true)}
                                        style={{"margin": "5px"}} pill>+</Badge>
                                </div>
                                <div style={{
                                    "display": "flex",
                                    "flexDirection": "row",
                                    "alignItems": "center"
                                }}>
                                    Executive Suite <Badge
                                    onClick={() => this.handleRoom(3, false)}
                                    style={{"margin": "5px"}} pill>-</Badge>
                                    <div>{this.state.guestNo[3]}</div>
                                    <Badge
                                        onClick={() => this.handleRoom(3, true)}
                                        style={{"margin": "5px"}} pill>+</Badge>
                                </div>
                            </div>
                            <Button color={"primary"} tag={"input"} type={"submit"} value={"Submit"}/>
                        </form>
                    </Card>
                </div>
                <br/>

                {
                    (JSON.stringify(this.state.searchData) === '["empty"]'
                        || JSON.stringify(this.state.searchData) === '["no match"]'
                        || JSON.stringify(this.state.searchData) === '["page_exceeded"]'
                        || JSON.stringify(this.state.searchData) === '["error_loading_detail_by_ID"]'
                        || JSON.stringify(this.state.searchData) === '["undefined_query_params"]'
                        || JSON.stringify(this.state.searchData) === '["loading..."]'
                    )
                        ?
                        <p>{this.state.searchData}</p>
                        :
                        <ListGroup className="centerLoc">
                            {this.state.searchData.map((hotel, i) =>
                                <ListGroupItem key={i}>
                                    <div>
                                        <div
                                            style={{
                                                "display": "flex",
                                                "alignItems": "center",
                                                "justifyContent": "center",
                                                "flexDirection": "row",
                                                "width": "100%"
                                            }}
                                        >
                                            <div style={{"textAlign": "left"}}>
                                                <img id={"img" + i}
                                                     style={{"height": "200px", "width": "200px", "objectFit": "cover"}}
                                                     src={hotel[4]}
                                                     alt={"image of hotel ID " + hotel[0]}
                                                     onError={() => document.getElementById("img" + i).src = errImg}
                                                />
                                            </div>
                                            <div style={{
                                                width: "100%"
                                            }}>
                                                <Card
                                                    style={{
                                                        height: '200px',
                                                        width: '70rem'
                                                    }}
                                                >
                                                    <CardBody>
                                                        <CardTitle tag="h5">
                                                            {hotel[1]}
                                                        </CardTitle>
                                                        <CardSubtitle
                                                            className="mb-2 text-muted"
                                                            tag="h6"
                                                        >
                                                            {"S$: " + hotel[2]}
                                                            <br/>
                                                            <Ratings
                                                                widgetDimensions="20px"
                                                                widgetSpacings="0px"
                                                                rating={hotel[5]}
                                                                // widgetRatedColors="blue"
                                                            >
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                                <Ratings.Widget/>
                                                            </Ratings>
                                                        </CardSubtitle>
                                                        <CardText>
                                                            {"Address: " + hotel[3]}
                                                        </CardText>
                                                        <Button href={"hotel/" + hotel[0]}
                                                                target={"_blank"}
                                                                onClick={() => this.getBookingInfo()}>
                                                            Book
                                                        </Button>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroupItem>
                            )}
                        </ListGroup>

                }
                <div style={{"textAlign": "center"}}>
                    <p></p>
                    <button className="pageButton"
                            disabled={this.state.queryParams.page <= 1}
                            onClick={() => window.open("/search" + this.PageBtn(0), "_self")}>prev page
                    </button>
                    page: {this.state.queryParams.page}/{this.state.pageNo}
                    <button className="pageButton"
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