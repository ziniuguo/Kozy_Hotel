import React from "react";

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backendData: [],
            searchData: [],
            backendDataLoaded: false,
            searchDataLoaded: false,
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
            fetch("/searchapi" + location.search)
                .then(response => response.json())
                .then((json) => {
                        this.setState({
                            searchData: json,
                            searchDataLoaded: true
                        })
                    }
                )
        }
    }

    render() {
        return (
            <div>
                <form>
                    <label>
                        Search:
                        <input type="text" name="q"/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                {(this.state.backendDataLoaded)
                    ? this.state.backendData.users.map((user, i) =>
                            <p key={i}>{user}</p>
                        )
                    : <p>loading</p>
                }
                <p>search result test:</p>
                {(this.state.searchDataLoaded)
                    ? "From react: " + location.search +
                    " ============= Response from express: " + JSON.stringify(this.state.searchData)
                    : <p></p>
                }

            </div>
        )
    }
}

export default Result;