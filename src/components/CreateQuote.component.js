import React, { Component } from 'react';
import Image from 'react-bootstrap/Image';
import BoldAndBrash from '../assets/B&B.png'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "./Card";
import Form, { FormLabel } from "react-bootstrap/Form";


export default class TypingTest extends Component {

    constructor(props){
        super(props)

        this.checkLogin = this.checkLogin.bind(this);
        this.onChangeQuoteTitle = this.onChangeQuoteTitle.bind(this);
        this.onChangeQuoteBody = this.onChangeQuoteBody.bind(this);
        this.onChangeQuoteAuthor = this.onChangeQuoteAuthor.bind(this);

        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.state = {
            // validation
            loggedIn : true,
            quoteTitleValid : false,
            quoteBodyValid : false,
            quoteAuthorValid : false,
            formValid : false, 
            formErrors : {quoteTitle: '', quoteBody : '', quoteAuthor : ''},

            formValidAndUser : false,

            // user
            userName : '',


            // Quote state
            quoteTitle : '',
            quoteBody : '',
            quoteAuthor : ''
        }
    }

    componentDidMount(){
        console.log(this.props.location.state)
    }

    // Check if user is logged in
    checkLogin() {
        this.setState({
            loggedIn : true,
        })
    }

    onChangeQuoteTitle(e) {
        const fieldName = e.target.name;
        this.setState({
            quoteTitle : e.target.value},
            () => {this.validateField(fieldName, this.state.quoteTitle)
        })
    }

    onChangeQuoteBody(e) {
        const fieldName = e.target.name;
        this.setState({
            quoteBody : e.target.value},
            () => {this.validateField(fieldName, this.state.quoteBody)
        })
    }

    onChangeQuoteAuthor(e) {
        const fieldName = e.target.name;
        this.setState({
            quoteAuthor : e.target.value},
            () => {this.validateField(fieldName, this.state.quoteAuthor)
        })
    }

    validateField(fieldName, value) {
        let fieldValidateErrors = this.state.formErrors;
        let quoteTitleValid = this.state.quoteTitleValid;
        let quoteBodyValid = this.state.quoteBodyValid;
        let quoteAuthorValid = this.state.quoteAuthorValid;

        switch(fieldName) {
            
            case 'quoteTitle':
                
                quoteTitleValid = value.length >= 0 && value.length < 40;
                fieldValidateErrors.quoteTitle = quoteTitleValid ? '' : ' must not be empty or greater than 20 characters.';
                break;
            
            case 'quoteBody':
                
                quoteBodyValid = value.length >= 200  && value.length <= 350 ;
                fieldValidateErrors.quoteBody = quoteBodyValid ? '' : ' is too short';
                
                break;

            case 'quoteAuthor':

                if (value.length == 0){
                    quoteAuthorValid = true;
                    this.setState((state) => ({
                        quoteAuthor : state.username
                    }), () => {fieldValidateErrors.quoteAuthor = quoteAuthorValid ? '' : ''})
                    break;
                }
                else if (value.length <= 10) {
                    quoteAuthorValid = true
                    fieldValidateErrors.quoteAuthor = quoteAuthorValid ? '' : ' is short long';
                    break;
                }

            default:
                break;

        }

        this.setState({
            formErrors : fieldValidateErrors, 
            quoteTitleValid : quoteTitleValid, 
            quoteBodyValid : quoteBodyValid,
            quoteAuthorValid : quoteAuthorValid
        },    
            this.validateForm);
        
    }

     // ValidaateForm function sets the current state of the fields of the form.
     validateForm() {
         
        this.setState({
            formValid:  this.state.quoteTitleValid &&
                        this.state.quoteBodyValid && 
                        this.state.quoteAuthorValid,
            
                    });

        
    }

    

    render() {
        return (
            <div className="container">
               <Card>
                    <Row>  
                        <Col sm={7}>
                            <Form>
                                <Form.Group >
                                    <h4>Create Quote</h4>
                                    <Form.Label>Quote Title: </Form.Label>
                                    <Form.Control 
                                        value={this.state.quoteTitle}
                                        id = "quoteTitle"
                                        onChange = {this.onChangeQuoteTitle}
                                        name ="quoteTitle"
                                        
                                    /><br />
                                    
                                    <Form.Label>Quote: </Form.Label>
                                    <Form.Control
                                        
                                       value={this.state.quoteBody}
                                        id = "quoteBody"
                                        onChange = {this.onChangeQuoteBody}
                                        name = "quoteBody"
                                        as="textarea" rows = "4"
                                    />

                                    <Form.Label>Quote Author: </Form.Label>
                                    <Form.Control
                                        
                                        value={this.state.quoteAuthor}
                                        id = "quoteAuthor"
                                        onChange = {this.onChangeQuoteAuthor}
                                        name = "quoteAuthor"
                                        
                                    />   
                                </Form.Group>

                                <Button type="submit" variant="info" onClick={this.login} disabled={!this.state.formValid}>
                                    Create Quote
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