import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Link} from "react-router-dom"; 
import TypingTest from './components/test.component';
import CreateQuote from './components/CreateQuote.component';
import Quotes from './components/quotes.component';
import Login from './components/login.component';
import Account from './components/account.component';
import Profile from './components/profile.component';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import { ThemeProvider } from "styled-components";
import lightTheme from "./themes/light";
import darkTheme from "./themes/dark";


import Container from "./components/Container";
import Button from 'react-bootstrap/Button';
import NavIcon from './components/NavIcon';


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
            <Navbar collapseOnSelect expand="lg" bg={isDarkMode ? 'dark' : 'light'} variant={isDarkMode ? 'dark' : 'light'} sticky="top">
              <NavbarBrand>
                <NavIcon></NavIcon>
              </NavbarBrand>
              <NavbarBrand>Typing Test</NavbarBrand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />

              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Link to="/" className="nav-link" id="navBarText">Test</Link>
                  <Link to="/quotes" className="nav-link">Quotes</Link>
                  <Link to="/createQuote" className="nav-link">Create Quote</Link>
                  <Link to="/account" className="nav-link">Account</Link>
                </Nav>
                <Nav>
                  <Button variant="outline-secondary" onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  localStorage.setItem("isDarkMode", !isDarkMode);
                  }}>
                  <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-circle-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 15V1a7 7 0 1 1 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
                  </svg>
                </Button>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
        </div>

          <Route path="/" exact component={TypingTest} />
          <Route path="/createQuote" component={CreateQuote} />
          <Route path="/quotes" component={Quotes} />
          <Route path="/login" component={Login} />
          <Route path="/account"exact component={Account} />
          <Route path="/profile" component={Profile} />
      
        </Router>  
      </Container>
        
    </ThemeProvider>
   
      
  );
}

export default App;
