import React, { Component } from 'react';
import axios from 'axios';
import Card from "./Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default class Profile extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

            id: '',
            username : '',
            email : '',
            signUpDate : '',

        }
    }

    componentDidMount() {
        let token = this.props.location.state.loggedInUser
        let APIURL = ''
        if (process.env.NODE_ENV === 'production') {
            APIURL = 'https://typingtest.jdoyle.ie'
        } else if (process.env.NODE_ENV === 'development') { 
            APIURL = 'http://localhost:8080'
        }
        axios.get(APIURL + '/user/profile',{ headers : { 'auth-token' : token}}  )
        .then( res => {
            console.log(this.state)
            if (res.data) {
                this.setState({
                    id : res.data._id,
                    username : res.data.userName,
                    email : res.data.userEmail,
                    signUpDate : res.data.signUpDate
                }, ()=> {console.log(this.state)})
            }
        })
    }

    render() {
        return (
            <div className="container">
                <Card>
                    <Row>  
                        <Col sm={5}>
                            <h3>Profile</h3>
                            <h5>Username:  {this.state.username}</h5>
                            <h5>Email:  {this.state.email}</h5>
                            <h5>Date Joined:  {this.state.signUpDate}</h5>
                        </Col> 
                    </Row>
                </Card>
                <div style={{ height : 800}}></div>
            </div>
        )
    }
}