import React, { useState } from 'react';
import logo from './assets/logo.png';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Link} from "react-router-dom"; 
import TypingTest from './components/test.component';
import CreateQuote from './components/CreateQuote.component';
import './App.css';
import { ThemeProvider } from "styled-components";
import lightTheme from "./themes/light";
import darkTheme from "./themes/dark";

import Container from "./components/Container";
import Button from './components/Button';
import NavLink from './components/NavLink'

const App = () => {

  const stored = localStorage.getItem("isDarkMode");
  const [isDarkMode, setIsDarkMode] = useState(
    stored === "true" ? true : false
  );

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        
        <Router>
          
          <div className="container">
              <NavLink className="navbar navbar-expand-lg navbar-light b-light">
                <a className="navbar-brand">
                  <img src={logo} width="30" height="30" alt="Typing Test" />
                </a>
                <Link to="/" className="navbar-brand">Typing Test</Link>
                <div className="collpase navbar-collapse">
                  <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                      <Link prefetch to="/">
                        <Link to="/" className="nav-link" id="navBarText">Test</Link>       
                      </Link>
                    </li>
                    <li className="navbar-item">
                      <Link to="/createQuote" className="nav-link">Create Quote</Link>
                    </li>
                    
                  </ul>
                </div>
                <Button onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  localStorage.setItem("isDarkMode", !isDarkMode);
                  }}>
                  <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-circle-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 15V1a7 7 0 1 1 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
                  </svg>
                </Button>
              </NavLink>
          </div>

          <Route path="/" exact component={TypingTest} />
          <Route path="/createQuote" component={CreateQuote} />
      
        </Router>  
      </Container>
        
    </ThemeProvider>
   
      
  );
}

export default App;
