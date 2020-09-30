import React, { Component } from 'react';
import axios from 'axios';
import Card from "./Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';

// Quote component
const Quote = props => (
    <div>
        <Alert variant="secondary">
            <Link to={{ pathname : '/', state: { id : props.quote._id }}} style={{color : '#202326'}}>
                <Alert.Heading>{props.quote.quoteTitle} -{props.quote.quoteAuthor}</Alert.Heading>
            </Link>
            <span>{props.quote.quoteBody}</span>
            <hr />
            <Row>
                <Col sm={8}>
                    <span style={{marginLeft : 10}}>Approved : {String(props.quote.quoteApproved)}</span> 
                    <span style={{marginLeft : 10}}>Rating : {props.quote.quoteScore}</span> 
                    <span style={{marginLeft : 10}}>High Score : {props.quote.highWPMScore}WPM {props.quote.highAccScore}% Accuracy</span>
                </Col>
                <Col sm={4}>
                    <div style={{float : 'right'}}>
                        <Alert.Link  variant="outline-seconary" style={{marginRight : 10}}>
                            Edit 
                        </Alert.Link>
                        <Alert.Link>
                            Delete
                        </Alert.Link>
                    </div>
                </Col>
            </Row>    
        </Alert>
        <br></br>
    </div>  
)


export default class Profile extends Component {

    constructor(props) {
        super(props);
        
        this.logout = this.logout.bind(this);
        this.getQuotes = this.getQuotes.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.deleteAccountModal = this.deleteAccountModal.bind(this);
        this.editAccount = this.editAccount.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.approveButton = this.approveButton.bind(this);

        this.state = {

            id: '',
            username : '',
            email : '',
            signUpDate : '',
            personalBestWPM : 0, 
            personalBestAcc : 0,
            quoteIds : [],
            quotes : [],
            APIURL : '',

            deleteAccountModal : false,
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
            if (res.data.isAdmin) {
                localStorage.setItem("nimdAis", res.data.isAdmin)
            }

            if (res.data) {
                console.log(res.data)
                this.setState({
                    id : res.data._id,
                    username : res.data.userName,
                    email : res.data.userEmail,
                    signUpDate : res.data.signUpDate.slice(0, 15),
                    personalBestWPM : res.data.personalBestWPM, 
                    personalBestAcc : res.data.personalBestAcc,
                    quoteIds : res.data.quotesAdded
                })
                this.getQuotes();
            }
        })
    }

    getQuotes() {
        if (this.state.quoteIds.length > 0) {
            this.state.quoteIds.forEach(Id => {
                axios.get(this.state.APIURL + '/quotes/' + Id)
                .then(res => {

                    if (res.data) {
                        this.setState({
                            quotes : [...this.state.quotes, res.data]
                        })
                    }
                })
            })
        }
        
    }

    quotesComponentsList () {
        if (this.state.quotes.length > 0)
        {
            return this.state.quotes.map(function(currentQuote, i) {
                return <Quote quote={currentQuote} key={i} index={i} />
            })
        }
        else {
            return  <Link to='/createQuote'><Button> Add Some Quotes!</Button></Link>
        }
       
    }

    logout() {
        localStorage.removeItem("beepboop")
        localStorage.removeItem('nimdAis')
        this.props.history.push({
            pathname : "/login",
        })
    }

    deleteAccountModal() {
       this.handleClose()
    }

    handleClose (){
        this.setState({
            deleteAccountModal : !this.state.deleteAccountModal
        })
    }

    deleteAccount() {
        let token = localStorage.getItem('beepboop')
        localStorage.removeItem('beepboop')
       
        const user = {
            userName : this.state.username,
            userEmail : this.state.email
        }
        //console.log(user)
        axios.post(this.state.APIURL + '/user/delete', user , {headers : {'auth-token' : token}})
        

        this.props.history.push({
            pathname : '/login'
        });
    }

    editAccount() {
        let token = localStorage.getItem('beepboop')
        
        const user = {
            userName : this.state.username,
            userEmail : this.state.email,
            userId : this.state.id,
        }

        this.props.history.push({
            pathname : '/editAccount',
            state : { id : this.state.id }
        })

       
    }

    approveButton () {
        if (localStorage.getItem('nimdAis')) {
            return <Link to='/approveQuote'><Button variant="outline-success" style={{marginLeft : 10}}>Approve Quotes</Button></Link>
        }
    }

    render() {
        return (
            
            <div className="container">
                <Modal
                    show={this.state.deleteAccountModal}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header>
                    <Modal.Title>Delete Account?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete your account? This is not reversable.
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Nevermind
                    </Button>
                    <Button variant="danger" onClick={this.deleteAccount}>Delete Account</Button>
                    </Modal.Footer>
                </Modal>
                
                <Card>
                    <Row>  
                        <Col sm={9}>
                            <h3>{this.state.username}'s Profile</h3>
                            <h5>Email:  {this.state.email}</h5>
                            <h5>Date Joined:  {this.state.signUpDate}</h5>
                        </Col> 
                        <Col sm={3}>
                            <h4>Personal Best:</h4>
                            <Alert variant="info">
                                <span>
                                    WPM : {this.state.personalBestWPM} <br></br>
                                    Accuracy : {this.state.personalBestAcc}% <br></br>
                                </span>       
                            </Alert>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col >
                            <br/>
                            <Link to='/editAccount'>
                                <Button variant="outline-info" onClick={this.editAccount} style={{marginRight : 10}} disabled={true}>
                                    Edit Account
                                </Button>
                            </Link>
                            
                            <Button variant="outline-warning" onClick={this.logout} style={{marginRight : 10}}>
                                Logout
                            </Button>
                            <Button variant="outline-danger" onClick={this.deleteAccountModal}>
                                Delete Account
                            </Button>

                            {this.approveButton()}
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <h4>Your Quotes:</h4>
                            <div>
                                {this.quotesComponentsList()}
                                
                            </div>
                        </Col>
                        
                    </Row>
                </Card>
                <div style={{ height : 800}}></div>
            </div>
        )
    }
}