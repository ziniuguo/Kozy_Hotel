import React, {useEffect, useState} from 'react';
import Br from "./tags";
import {render} from "react-dom";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom'
import Result from "./Result";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path='/' element={
                        <p>
                            <Link to="/result">see search page</Link>
                        </p>
                    }></Route>
                    <Route exact path='/result' element={< Result />}></Route>
                </Routes>
            </Router>
        )
    }

}

export default App;