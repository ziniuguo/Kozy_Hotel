import React, {useEffect, useState} from 'react';

function App() {
    const [backendData, setBackendData] = useState([{}])
    useEffect(() => {
        fetch("/api").then(
            response => response.json()
        ).then(
            data => {
                setBackendData(data)
            }
        )
    }, []);
    console.log(typeof backendData);
    return (
        <div>
            {/*{JSON.stringify(backendData)}*/}
            {(typeof backendData.users === "undefined")
                ? <p>loading</p>
                // : (<p>fuck you</p>)
                : backendData.users.map((user, i) =>
                    <p key={i}>{user}</p>
                )
            }
        </div>
    )
}

export default App;