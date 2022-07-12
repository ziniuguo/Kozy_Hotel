import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Result from "./Result";
import MainPage from "./MainPage";
import RoomDetail from "./RoomDetail";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={
                        <MainPage/>
                    }></Route>
                    <Route path='/search' element={<Result/>}></Route>
                    <Route path='/room/:roomDetail' element={<RoomDetail/>}></Route>
                </Routes>
            </BrowserRouter>
        )
    }

}

export default App;