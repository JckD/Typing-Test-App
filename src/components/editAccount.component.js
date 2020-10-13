import React, { Component } from 'react';
import Form from "react-bootstrap/Form"
import { Link } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from "./Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


export default class EditAccount extends Component {

    constructor(props) {
        super(props)

        this.onChangeAccountUsername = this.onChangeAccountUsername.bind(this);
        this.onChangeAccountEmail = this.onChangeAccountEmail.bind(this);
        this.onChangeAccountPassword = this.onChangeAccountPassword.bind(this);
        this.onChangeAccountConfirmPassword = this.onChangeAccountConfirmPassword.bind(this);
        this.onChangeCurrentPassword = this.onChangeCurrentPassword.bind(this);
        this.editAccount = this.editAccount.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.passwordsMatch = this.passwordsMatch.bind(this);

        this.state ={

            oldUser : {
                id : '',
                userName : '',
                email : '',
                password : '',
            },

            newInput : {
                userName : '',
                email : '',
                password : '',
                confirmPassword : '',
                id : ''
            },

            newUser : {
                userName : '',
                email : '',
                password : '',
            },

            onChangeCurrentPassword : '',
            Modal : true,

           token : ''
        }
    }

    componentDidMount() {

        let token = localStorage.getItem('beepboop')
        let APIURL = ''
        if (process.env.NODE_ENV === 'production') {
            APIURL = 'https://typingtest.jdoyle.ie'
            this.setState({
                APIURL : 'https://typingtest.jdoyle.ie'
            })
        } else if (process.env.NODE_ENV === 'development') { 
            APIURL = 'http://localhost:8080'
            this.setState({
                APIURL : 'http://localhost:8080'
            })
        }
        axios.get(APIURL + '/user/profile',{ headers : { 'auth-token' : token}}  )
        .then( res => {
            //console.log(this.state)
            if (res.data) {
                this.setState({
                    oldUser : {
                        id : res.data._id,
                        userName : res.data.userName,
                        email : res.data.userEmail,
                    },
                    token : token
                })

            }
        })
    
    }

    editAccount() {

        const tempUser = this.state.newInput
        console.log(tempUser)
        //console.log(this.state.oldUser.password)
        // Check if user has entered a new passowrd
        if (this.state.newInput.password === "" && this.passwordsMatch) {
            tempUser.password  = this.state.oldUser.password   
        }
        
        // check if user has entered a new username
        if (this.state.newInput.userName === '') {
            tempUser.userName = this.state.oldUser.userName
        } 

        // check if users has enetered a new email
        if (this.state.newInput.email === '') {
            tempUser.email = this.state.oldUser.email
        } 
            
        tempUser.id = this.state.oldUser.id
        console.log(tempUser)
        // post req
        axios.post(this.state.APIURL + '/user/update', tempUser, { headers : {'auth-token' : this.state.token }})
        .then(res => {
            console.log(res.data)
        }).catch(err => err)
    }


    // Create Account inputs
    onChangeAccountUsername(e) {
        const fieldName = e.target.name;
        this.setState({
            newInput : {
                userName : e.target.value,
                email : this.state.newInput.email,
                password : this.state.newInput.password,
                confirmPassword : this.state.newInput.confirmPassword,
            }},
           // () => {this.validateField(fieldName, this.state.newUserName)} 
        );
    }

    onChangeAccountEmail(e) {
        const fieldName = e.target.name;
        //console.log(fieldName);
        this.setState({
            newInput : {

               email: e.target.value,
               userName : this.state.newInput.userName,
               password : this.state.newInput.password,
               confirmPassword : this.state.newInput.confirmPassword,
            }},
           // () => {this.validateField(fieldName, this.state.newEmail)}
        );  
    }

    onChangeAccountPassword(e) {
        const fieldName = e.target.name;
        this.setState({
            newInput : {
                password: e.target.value,
                confirmPassword : this.state.newInput.confirmPassword,
                userName : this.state.newInput.userName,
                email : this.state.newInput.email,
            }},
           // () => {this.validateField(fieldName, this.state.newPassword)}
        );
    }

    onChangeAccountConfirmPassword(e) {
        const fieldName = e.target.name;
        this.setState({
            newInput : {
                confirmPassword: e.target.value,
                userName : this.state.newInput.userName,
                email : this.state.newInput.email,
                passowrd : this.state.newInput.password,
            }},
           // () => {this.validateField(fieldName, this.state.newConfirmPassword)}
        );
    }

    onChangeCurrentPassword(e) {
        const fieldName = e.target.name;
        this.setState({
            onChangeCurrentPassword : e.target.value
        })
    }

    checkPassword (){
        const loginAccount = {
            userName : this.state.oldUser.userName,
            userPassword : this.state.onChangeCurrentPassword
        }

        this.setState((state) => ({
            oldUser : {
                ...state.oldUser,
                password : loginAccount.userPassword
            }
        })

        )
        //console.log(loginAccount)
        axios.post(this.state.APIURL + '/user/login' , loginAccount, {withCredentials:true})
        .then(res => {
            
            if (res.data) {
                //console.log('beep')
                this.setState({
                    Modal : false
                })
            }
        }).catch (err => err) 
    }



    // check if both entries of passwords match returns true / false
    passwordsMatch() {
        if (this.state.newPassword === this.state.newConfirmPassowrd) {
            return true
        }
        else {
            return false
        }
    }

    render() {
        return (
            <div className="container">

                <Modal
                    show={this.state.Modal}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header>
                       <Modal.Title>Enter your current Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Enter your current password to edit your Account.
                        <Form>
                            
                            <Form.Control 
                                value={this.state.onChangeCurrentPassword}
                                type = "password"
                                id = "inputUserName"
                                onChange = {this.onChangeCurrentPassword}
                                name = "Username"
                           />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Link to="/profile">
                        <Button variant="secondary" onClick={this.handleClose}>
                            Nevermind
                        </Button>
                    </Link>
                    
                    <Button variant="danger" onClick={this.checkPassword}>Edit Account</Button>
                    </Modal.Footer>
                </Modal>

                <Card>
                    <Row>
                        <Col sm={5}>
                            <Form>
                                <Form.Group>
                                    <h4>Edit Account</h4>
                                    <Form.Label>User Name:</Form.Label>
                                    <Form.Control 
                                        value={this.state.newInput.userName}
                                        id = "inputUserName"
                                        onChange = {this.onChangeAccountUsername}
                                        name = "Username"
                                        placeholder = {this.state.oldUser.userName}
                                    /><br />

                                    <Form.Label>Email: </Form.Label>
                                    <Form.Control 
                                        value={this.state.newInput.email}
                                        id = "inputUserEmail"
                                        onChange = {this.onChangeAccountEmail}
                                        name = "Email"
                                        placeholder = {this.state.oldUser.email}
                                    /><br />
                                    
                                    <Form.Label>Password: </Form.Label>
                                    <Form.Control
                                        type = "password"
                                        value={this.state.newInput.password}
                                        id = "inputPassword"
                                        onChange = {this.onChangeAccountPassword}
                                        name = "Password"
                                    />
                                    <Form.Label>Confirm Password: </Form.Label>
                                    <Form.Control
                                        type = "password"
                                        value={this.state.newInput.confirmPassword}
                                        id = "inputConfirmPassword"
                                        onChange = {this.onChangeAccountConfirmPassword}
                                        name = "ConfirmPassword"
                                    />
                                </Form.Group>

                                 <Link to="/profile">
                                    <Button variant="secondary" style={{ marginRight : 10}}>
                                        Cancel
                                    </Button>
                                </Link>

                                <Button  variant="info" onClick={this.editAccount}>
                                    Save
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

