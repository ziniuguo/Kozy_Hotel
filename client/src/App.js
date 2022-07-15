import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Result from "./Result";
import MainPage from "./MainPage";
import RoomDetail from "./RoomDetail";
import BookingPage from "./BookingPage";
import {Button} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


// class App extends React.Component {
//     render() {
//         return (
//             <BrowserRouter>
//                 <Routes>
//                     <Route path='/' element={
//                         <MainPage/>
//                     }></Route>
//                     <Route path='/search' element={<Result/>}></Route>
//                     <Route path='/hotel/:roomDetail' element={<RoomDetail/>}></Route>
//                     <Route path='/booking/:roomBooked' element={<BookingPage/>}></Route>
//                 </Routes>
//             </BrowserRouter>
//         )
//     }
//
// }

function App() {
    console.log(Button)
    return (
        <div>
            <Button>Hello</Button>
        </div>
    )
}

export default App;