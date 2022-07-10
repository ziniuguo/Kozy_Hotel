import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Result from "./Result";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={
                        <p>
                            <Link to="/search">see search page</Link>
                        </p>
                    }></Route>
                    <Route path='/search' element={<Result/>}></Route>

                </Routes>
            </BrowserRouter>
        )
    }

}

export default App;