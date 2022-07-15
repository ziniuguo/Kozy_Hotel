import React from "react";
import {Link} from "react-router-dom";
import qs from 'query-string';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Br from "./tags";


class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchData: [],
            searchDataLoaded: false,
            queryParams: {q: "", page: 1, loc: "Singapore"},
            pageNo: 1,
        }
    }

    componentDidMount() {
        // check params
        if (location.search) {
            this.setState({queryParams: qs.parse(location.search)});
            fetch("/searchapi" + location.search)
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
                return ('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) + 1) + "&loc=" + this.state.queryParams.loc);
            } else {
                return ('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) - 1) + "&loc=" + this.state.queryParams.loc);
            }
        } else {
            return location.search;
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
                        <label>You are visiting:</label>
                        <select name="loc" value={this.state.queryParams.loc} onChange={()=>document.getElementById("locForm").submit()}>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Singapore">Singapore</option>
                        </select>
                        <input style={{display: 'none'}} type="text" defaultValue={this.state.queryParams.page} name="page"/>
                        <input style={{display: 'none'}} type="text" defaultValue={this.state.queryParams.q} name="q"/>

                    </form>
                </div>
                <div>
                    <h2>search</h2>
                </div>
                <form>
                    <label>
                        Search:
                        <input type="text" defaultValue={this.state.queryParams.q} name="q"/>
                        <input style={{display: 'none'}} type="text" defaultValue="1" name="page"/>
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