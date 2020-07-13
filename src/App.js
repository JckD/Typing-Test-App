import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Link} from "react-router-dom"; 
import TypingTest from './components/test.component';
import CreateQuote from './components/CreateQuote.component';
import Quotes from './components/quotes.component';
import Login from './components/login.component';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import NavDropdown from 'react-bootstrap/NavDropdown';
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
                  <NavDropdown title="Account">
                    <NavDropdown.Item href="/login">      
                        Profile
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                        </svg> 
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="http://localhost:8080/logout">Logout
                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-door-closed" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2zm1 0v13h8V2H4z"/>
                        <path d="M7 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        <path fill-rule="evenodd" d="M1 15.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
                      </svg>
                    </NavDropdown.Item>
                  </NavDropdown>
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
      
        </Router>  
      </Container>
        
    </ThemeProvider>
   
      
  );
}

export default App;
