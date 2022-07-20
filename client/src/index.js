import React from 'react';
import ReactDOM from 'react-dom/client';
// older version:
// import ReactDOM from 'react-dom';
import App from './App';
import './assets/style.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

// older version:
// ReactDOM.render(
//     <App/>,
//     document.getElementById('root')
// );
