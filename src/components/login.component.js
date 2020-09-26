import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Card from "./Card";
import Button from "react-bootstrap/Button";
import Form  from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";
import Alert from "react-bootstrap/Alert"

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.login = this.login.bind(this);
        this.onChangeLoginUsername = this.onChangeLoginUsername.bind(this);
        this.onChangeLoginPassword = this.onChangeLoginPassword.bind(this);

        this.state = {

            inputEmail : '',
            inputUsername : '',
            inputPassword : '',
            isEmail : false,

            formErrors: {username: '', email: '', password: ''},
            usernameValid : false,
            emailValid: false,
            passwordValid: false,
            formValid: false,
            loggedInUser : {},

            error : false,
            
        }
    }

    componentDidMount() {
      


    }

    onChangeLoginUsername(e) {
        const fieldName = e.target.name;
        this.setState({
            inputUsername : e.target.value},
            () => {this.validateField(fieldName, this.state.inputUsername)
        });
    }

    onChangeLoginPassword(e) {
        const fieldName = e.target.name;
        this.setState({
            inputPassword : e.target.value},
            () => {this.validateField(fieldName, this.state.inputPassword)
        });
    }

    //  Validate Field function takes name of field that is being validated and the value in that field
    //  Check if Email is valid format using regex
    //  Check if Password is longer than 6 characters
    //  Check if Username is longer than 4 chacracters
    validateField(fieldName, value) {
        let fieldValidateErrors = this.state.formErrors;
        let passwordValid = this.state.passwordValid;
        let usernameValid = this.state.usernameValid;

        switch(fieldName) {
            
            case 'Password':
                passwordValid = value.length >= 6;
                fieldValidateErrors.password = passwordValid ? '' : ' is too short';
                break;
            
            case 'Username':
                
                usernameValid = value.length >=4;
                fieldValidateErrors.username = usernameValid ? '' : ' is too short';
                
                
                break;

            default:
                break;

        }

        this.setState({formErrors : fieldValidateErrors, 
                        usernameValid : usernameValid, 
                        passwordValid : passwordValid
                    },    
                        this.validateForm);
    }


    login(e) {
        e.preventDefault();

        const loginAccount = {
            userName : this.state.inputUsername,
            userPassword : this.state.inputPassword,
        }

        let APIURL = ''
        if (process.env.NODE_ENV === 'production') {
            APIURL = 'https://typingtest.jdoyle.ie'
        } else if (process.env.NODE_ENV === 'development') { 
            APIURL = 'http://localhost:8080'
        }
        
        axios.post(APIURL + '/user/login' , loginAccount, {withCredentials:true})
        .then(res => {
            console.log(res.data)
            localStorage.setItem("beepboop", res.data);
            this.props.history.push({
                             pathname : "/profile",
                             
            });
        })
        .catch(err => {
            this.setState({
                error : true
            })
        });
        
    }


    render() {
        return (
            <div className="container">
                <Card>
                    <Row>  
                        <Col sm={5}>
                            <Form>
                                <Form.Group >
                                    <h4>Login</h4>
                                    <Form.Label>User Name: </Form.Label>
                                    <Form.Control 
                                        value={this.state.account_username}
                                        id = "inputLoginUserName"
                                        onChange = {this.onChangeLoginUsername}
                                        name ="Username"
                                    /><br />
                                    
                                    <Form.Label>Password: </Form.Label>
                                    <Form.Control
                                        type = "password"
                                        value={this.state.account_password}
                                        id = "inputLoginPassword"
                                        onChange = {this.onChangeLoginPassword}
                                        name = "Password"
                                    />
                                      
                                </Form.Group>
                                <Button type="submit" variant="info" onClick={this.login} >
                                    Login
                                </Button>

                                <Link to="/account">
                                    <Button variant="secondary" style={{ marginLeft : 10}}>
                                        Create Account
                                    </Button>
                                </Link>
                            </Form>
                        </Col> 
                    </Row>
                    <br></br>
                    <Row>
                        <Col sm={5}>
                            <Collapse in={this.state.error}>
                                <div>
                                     <Alert variant={'danger'}>
                                    <p>Username or Password Incorrect</p>
                                </Alert>
                                </div>
                               
                            </Collapse>
                        </Col>
                        
                        
                    </Row>
                </Card>
                <div style={{ height : 800}}></div>
            </div>
        )
    }
}