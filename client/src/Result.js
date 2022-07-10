import React, {Component} from "react";

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backendData: [],
            loaded: false
        }
    }

    componentDidMount() {
        fetch("/api")
            .then(response => response.json())
            .then((json) => {
                    this.setState({
                        backendData: json,
                        loaded: true
                    })
                }
            )
    }

    render() {
        if (!this.state.loaded) return <div>loading</div>;

        return (
            <div>
                <form>
                    <label>
                        Search:
                        <input type="text" name="name"/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                {/*{JSON.stringify(backendData)}*/}
                {this.state.backendData.users.map((user, i) =>
                    <p key={i}>{user}</p>
                )}
                <p>search result:</p>

            </div>
        )
    }
}

export default Result;