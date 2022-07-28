import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Result from "./Result";
import MainPage from "./MainPage";
import RoomDetail from "./RoomDetail";
import BookingPage from "./BookingPage";
import Login from "./Login";
import Manage from "./Manage";
import Profile from "./Profile";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/*' element={<MainPage/>}></Route>
                    <Route path='/search/*' element={<Result/>}></Route>
                    <Route path='/hotel/:roomDetail' element={<RoomDetail/>}></Route>
                    <Route path='/booking/:roomBooked' element={<BookingPage/>}></Route>
                    <Route path='/profile/*' element={<Profile/>}></Route>
                    <Route path='/profile/login' element={<Login/>}></Route>
                    <Route path='/profile/manage' element={<Manage/>}></Route>

                </Routes>
            </BrowserRouter>
        )
    }

}



export default App;