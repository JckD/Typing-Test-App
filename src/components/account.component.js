import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Card from "./Card";
import Button from "react-bootstrap/Button";
import Form, { FormLabel } from "react-bootstrap/Form";
import styled from 'styled-components';

//import { FormErrors } from './FormErrors';


// Account component for creating accounts
// Includes clients side validation of credentials.

export default class Account extends Component {

    constructor(props) {

        super(props);

        this.onChangeAccountUsername = this.onChangeAccountUsername.bind(this);
        this.onChangeAccountEmail = this.onChangeAccountEmail.bind(this);
        this.onChangeAccountPassword = this.onChangeAccountPassword.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {

            account_username:'',
            account_email:'',
            account_password:'',
            account_favourties: [],
            formErrors: {username: '', email: '', password: ''},
            usernameValid : false,
            emailValid: false,
            passwordValid: false,
            formValid: false,
            loggedUser : {},
        }
    }

    onChangeAccountUsername(e) {
        const fieldName = e.target.name;
        this.setState({
            account_username: e.target.value},
            () => {this.validateField(fieldName, this.state.account_username)           
        });
    }

    onChangeAccountEmail(e) {
        const fieldName = e.target.name;
        //console.log(fieldName);
        this.setState({
            account_email: e.target.value},
            () => {this.validateField(fieldName, this.state.account_email)
        });  
    }

    onChangeAccountPassword(e) {
        const fieldName = e.target.name;
        this.setState({
            account_password: e.target.value},
            () => {this.validateField(fieldName, this.state.account_password)
        });
    }

    //  Validate Field function takes name of field that is being validated and the value in that field
    //  Check if Email is valid format using regex
    //  Check if Password is longer than 6 characters
    //  Check if Username is longer than 4 chacracters
    validateField(fieldName, value) {
        let fieldValidateErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let usernameValid = this.state.usernameValid;

        switch(fieldName) {
            case 'Email' :
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidateErrors.email = emailValid ? '' : ' is invalid';
                break;
            
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
                        emailValid : emailValid, 
                        passwordValid : passwordValid
                    },    
                        this.validateForm);
    }

    // ValidaateForm function sets the current state of the fields of the form.
    validateForm() {
        this.setState({formValid:this.state.usernameValid && this.state.emailValid && this.state.passwordValid});
    }

    onSubmit(e) {
        e.preventDefault();
        const newAccount = {
            userName: this.state.account_username,
            userEmail : this.state.account_email,
            userPassword : this.state.account_password,
            
        }
        
        axios.post('http://localhost:8080/user/register', newAccount, {withCredentials:true})
        .then(res => {
            if(res.status(400)){
                console.log('email in use')
            }
        })
            
        this.setState = ({
            account_username:'',
            account_email:'',
            account_password:'',
        });

        this.props.history.push({
            pathname : "/account/login",
            
            });
    }

    componentDidMount() {

        // axios.get('http://localhost:8080/user/',{withCredentials:true})
        // .then(res => {
        //     console.log(res.data)
        //     if (res.data)
        //     {
        //         this.props.history.push({
        //             pathname : "/account/user",
        //             state : { loggedInUser : res.data}
        //             });
        //     }
            
        // })
    }


   

    render() {
        return (
            <div className="container">
                <Card>
                    <Row>      
                        <Col sm={5}>
                            <Form>
                                <Form.Group >
                                    <h4>Create Account</h4>
                                    <Form.Label>User Name: </Form.Label>
                                    <Form.Control 
                                        value={this.state.account_username}
                                        id = "inputUserName"
                                        onChange = {this.onChangeAccountUsername}
                                        name = "Username"
                                    /><br />

                                    <Form.Label>Email: </Form.Label>
                                    <Form.Control 
                                        value={this.state.account_email}
                                        id = "inputUserEmail"
                                        onChange = {this.onChangeAccountEmail}
                                        name = "Email"
                                    /><br />
                                    
                                    <Form.Label>Password: </Form.Label>
                                    <Form.Control
                                        type = "password"
                                        value={this.state.account_password}
                                        id = "inputPassword"
                                        onChange = {this.onChangeAccountPassword}
                                        name = "Password"
                                    />
                                      
                                </Form.Group>
                                <Button type="submit" variant="info" onClick={this.onSubmit} disabled={!this.state.formValid}>
                                    Create Account
                                </Button>
                            </Form>
                        </Col>
                        <Col sm={2}></Col>
                        <Col sm={5}>
                            <Form>
                                <Form.Group >
                                    <h4>Login</h4>
                                    <Form.Label>User Name / Email: </Form.Label>
                                    <Form.Control 
                                        value={this.state.account_username}
                                        id = "inputUserName"
                                        onChange = {this.onChangeAccountUsername}
                                        name = "Username"
                                    /><br />
                                    
                                    <Form.Label>Password: </Form.Label>
                                    <Form.Control
                                        type = "password"
                                        value={this.state.account_password}
                                        id = "inputPassword"
                                        onChange = {this.onChangeAccountPassword}
                                        name = "Password"
                                    />
                                      
                                </Form.Group>
                                <Button type="submit" variant="info" onClick={this.onSubmit} disabled={!this.state.formValid}>
                                    Login
                                </Button>
                            </Form>
                        </Col>
                        
                    </Row>

                </Card>
                <div style={{ height : 800}}></div>

            </div>
        )
    }
}