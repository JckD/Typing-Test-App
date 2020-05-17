import React from 'react';
import logo from './assets/logo.png';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; 
import TypingTest from './components/test.component';
import CreateQuote from './components/CreateQuote.component';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light b-light">
          <a className="navbar-brand">
            <img src={logo} width="30" height="30" alt="Typing Test" />
          </a>
          <Link to="/" className="navbar-brand">Typing Test</Link>
          <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Test</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/createQuote" className="nav-link">Create Quote</Link>
                </li>
              </ul>
            </div>
        </nav>
       
      </div>

      <Route path="/" exact component={TypingTest} />
      <Route path="/createQuote" component={CreateQuote} />
      
    </Router>  
      
  );
}

export default App;
