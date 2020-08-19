import React, { Component } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Card from "./Card";
import Button from "react-bootstrap/Button";
import Form, { FormLabel } from "react-bootstrap/Form";
import styled from 'styled-components';
import { Link } from "react-router-dom";

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.login = this.login.bind(this);

        this.state = {

        }
    }

    componentDidMount() {
      


    }

    login() {
        axios({
            method: 'get',
            url: 'http://jdoyle.ie/api/public',
             responseType : 'stream'
        })
        .then(function(response) {
            console.log(response.data)
        })
    }
    render() {
        return (
            <div className="container">
                <Card>
        
                
                    <Row>
                        
                        <Col>
                            <Form style={{ width : 250}}>
                                <Form.Group>
                                    <h4>Login</h4>
                                    <Form.Label>User Name: </Form.Label>
                                    <Form.Control 
                                        
                                        id = "inputUserName"
                                    /><br />
                                    
                                    <Form.Label>Password: </Form.Label>
                                    <Form.Control
                                        type = "password"
                                        id = "inputPassword"
                                    />
                                      
                                </Form.Group>
                                <Button type="" variant="secondary" onClick={this.login}>
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