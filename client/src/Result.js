import React from "react";
import {Link} from "react-router-dom";
import qs from 'query-string';



class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backendData: [],
            searchData: [],
            backendDataLoaded: false,
            searchDataLoaded: false,
            queryParams: {q: "", page: 1},
            pageNo: 1
        }
    }

    componentDidMount() {
        // fetch all backend data
        fetch("/api")
            .then(response => response.json())
            .then((json) => {
                    this.setState({
                        backendData: json,
                        backendDataLoaded: true
                    })
                }
            )

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

    PageBtn (i) {
        if (Object.hasOwnProperty.bind(this.state.queryParams)('q') &&
            Object.hasOwnProperty.bind(this.state.queryParams)('page')) {
            if (i===1) {
                return('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) + 1));
            } else {
                return('?q=' + this.state.queryParams.q + '&page=' + (parseInt(this.state.queryParams.page, 10) - 1));
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
                    JSON.stringify(this.state.searchData)
                    : <p></p>
                }
                <div>
                    <p></p>
                    <button disabled={this.state.queryParams.page <= 1 || !Number.isInteger(this.state.pageNo)} onClick={() => window.open("/search" + this.PageBtn(0),"_self")}>prev page</button>
                    page: {this.state.queryParams.page}/{this.state.pageNo}
                    <button disabled={this.state.queryParams.page >= this.state.pageNo || !Number.isInteger(this.state.pageNo)} onClick={() => window.open("/search" + this.PageBtn(1),"_self")}>next page</button>
                </div>


                <div>
                    <h2>all data:</h2>
                    <p>data below should not be shown / retrieved as it may be really large</p>
                </div>
                {(this.state.backendDataLoaded)
                    ? this.state.backendData.hotels.map((hotel, i) =>
                        <p key={i}>{i}. {hotel}</p>
                    )
                    : <p>loading</p>
                }
            </div>
        )
    }
}

export default Result;