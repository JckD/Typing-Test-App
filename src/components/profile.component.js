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
import Badge from 'react-bootstrap/Badge';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import 'zingchart/es6';
import ZingChart from 'zingchart-react';

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
                        <Alert.Link style={{marginRight : 10}} onClick={props.edit}>
                            Edit
                        </Alert.Link>
                        <Alert.Link onClick={props.delete}>
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
        
        this.editAccount = this.editAccount.bind(this);
        this.approveButton = this.approveButton.bind(this);
        this.editQuote = this.editQuote.bind(this);
        this.deleteQuote = this.deleteQuote.bind(this);
        this.deleteThisQuote = this.deleteThisQuote.bind(this);
        this.showEditErrors = this.showEditErrors.bind(this);

        this.handleDeleteAccountClose = this.handleDeleteAccountClose.bind(this);
        this.handleDeleteQuoteClose = this.handleDeleteQuoteClose.bind(this);
        this.handleEditQuoteClose = this.handleEditQuoteClose.bind(this);
        this.saveQuote = this.saveQuote.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.onChangeQuoteTitle = this.onChangeQuoteTitle.bind(this);
        this.onChangeQuoteAuthor = this.onChangeQuoteAuthor.bind(this);
        this.onChangeQuoteBody = this.onChangeQuoteBody.bind(this);

        this.handleSelect = this.handleSelect.bind(this);


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
            unapprovedQuotesCount : 0,

            deleteAccountModal : false,
            deleteQuoteModal : false,
            editQuoteModal : false,

            activeTab : props.activeTab || 1,

            quoteTitleValid : false,
            quoteBodyValid : false,
            quoteAuthorValid : false,
            formValid : false, 
            formErrors : {quoteTitle: '', quoteBody : '', quoteAuthor : ''},

            editQuote : {
                quoteTitle : '',
                quoteAuthor : '',
                quoteBody : '',
            },

            deletingQuote : {
                quoteTitle : '',
            },

            
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


            let theme = '';
            console.log(localStorage.getItem("isDarkMode"))
            if (localStorage.getItem("isDarkMode")) {
                theme = 'dark';
            } else {
                theme = 'light';
            }
            console.log(theme)
            if (res.data) {
                //console.log(res.data)
                this.setState({
                    id : res.data._id,
                    username : res.data.userName,
                    email : res.data.userEmail,
                    signUpDate : res.data.signUpDate.slice(0, 15),
                    personalBestWPM : res.data.personalBestWPM,
                    personalBestAcc : res.data.personalBestAcc,
                    quoteIds : res.data.quotesAdded,
                    WPMChartConfig : {
                        theme : theme,
                        type : 'line',
                        title : {
                            text : 'Words Per Minute',
                        },
                        height : '60%',
                        legend : {},
                        scaleX : {
                            label : {
                                text : 'Typing Tests'
                            }
                        },
                        scaleY : {
                            label : {
                                text : 'WPM'
                            },
                            values: "0:100:25",
                            'ref-value' : 40,
                            'ref-line' : {
                                'line-color' : 'red',
                                'line-style' : 'solid'
                            }
                        },
                        series: [{
                            values : res.data.latestWPMScores,
                            text : 'Your WPM'
                        },{
                            values : 40,
                            text : 'Avg WPM'
                        }
                        ]
                    },

                    AccChartConfig : {
                        theme : theme,
                        type : 'line',
                        title : {
                            text : 'Typing Accuracy % ',
                        },
                        height : '70%',
                        legend : {},
                        scaleX : {
                            label : {
                                text : 'Typing Tests'
                            }
                        },
                        scaleY : {
                            label : {
                                text : 'Accuracy % '
                            },
                            values: "0:100:25",
                            'ref-value' : 92,
                            'ref-line' : {
                                'line-color' : 'red',
                                'line-style' : 'solid'
                            }
                        },
                        series: [{
                            values : res.data.latestAccScores,
                            text : 'Your Accuracy %'
                        },{
                            values : 92,
                            text : 'Avg Accuracy %'
                        }
                        ]
                    }

                }, () => console.log(this.state.chartConfig))
                this.getQuotes();
            }
        })

        //get unapproved quotes
        axios.get(APIURL + '/quotes/unapproved', {headers : {'auth-token' : token}})
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                    unapprovedQuotesCount : response.data.length
                });
                } else {
                    this.setState({
                        unapprovedQuotesCount : null
                    })
                }


            })
            .catch(function (err) {
                console.log(err);
            });
    }

   

    //#region Quotes list
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
        let edit = this.editQuote;
        let del = this.deleteQuote;
        if (this.state.quotes.length > 0)
        {
            return this.state.quotes.map(function(currentQuote, i) {
                return <Quote quote={currentQuote} key={i} index={i} edit={() => edit(currentQuote)} delete={() => del(currentQuote)}/>
            })
        }
        else {
            return  <Link to='/createQuote'><Button> Add Some Quotes!</Button></Link>
        }

    }
    //#endregion


    // Function that lets users edit a quote
    editQuote(quote) {
        //console.log(quote)
        this.setState({
            editQuote : quote
        }, () => this.handleEditQuoteClose())
    }

    // Function that lets users delete a quote
    deleteQuote(quote) {
        this.setState({
            deletingQuote : quote
        }, () => this.handleDeleteQuoteClose())
    }

    deleteThisQuote() {
        const quote = this.state.deletingQuote;

        let token = localStorage.getItem('beepboop');
        axios.post(this.state.APIURL + '/quotes/delete',  quote , { headers: { 'auth-token' : token}})
        .then(res => {
            console.log(res.data)
            this.setState({
                editQuoteModal : false
            })
            window.location.reload()
        })
        .catch(err => err)

    }

    //#region Edit Quote Modal Functions

    onChangeQuoteTitle(e) {
        const fieldName = e.target.name;
        this.setState({
            editQuote : {
                ...this.state.editQuote,
                quoteTitle : e.target.value,
            }
        }, () => {this.validateField(fieldName, this.state.editQuote.quoteTitle)})
    }

    onChangeQuoteAuthor(e) {
        const fieldName = e.target.name;
        this.setState({
            editQuote : {
                ...this.state.editQuote,
                quoteAuthor : e.target.value
            }
        }, () => {this.validateField(fieldName, this.state.editQuote.quoteAuthor)})
    }

    onChangeQuoteBody(e) {
        const fieldName = e.target.name;
        this.setState({
            editQuote : {
                ...this.state.editQuote,
                quoteBody : e.target.value
            }
        }, () => {this.validateField(fieldName, this.state.editQuote.quoteBody)})
    }

    // Saves the new edited quote
    saveQuote() {
        let token = localStorage.getItem('beepboop');
        let APIURL = ''
       //console.log(token)
        const editedQuote = this.state.editQuote;
        console.log(editedQuote)
        console.log(this.state.APIURL)
        axios.post(this.state.APIURL + '/quotes/update', editedQuote, { headers: { 'auth-token' : token}})
        .then(res => {
            //onsole.log(res.data)
            this.setState({
                editQuoteModal : false
            })
            window.location.reload()
        })
        .catch(err => err)
    }

    validateField(fieldName, value) {
        let fieldValidateErrors = this.state.formErrors;
        let quoteTitleValid = this.state.quoteTitleValid;
        let quoteBodyValid = this.state.quoteBodyValid;
        let quoteAuthorValid = this.state.quoteAuthorValid;

        //console.log(value)
        switch(fieldName) {
            
            case 'quoteTitle':
                
                quoteTitleValid = value.length >= 0 && value.length < 40;
                fieldValidateErrors.quoteTitle = quoteTitleValid ? '' : 'Quote Title must not be empty or greater than 20 characters.';
                break;
            
            case 'quoteBody':
                
                quoteBodyValid = value.length >= 200  && value.length <= 350 ;
                fieldValidateErrors.quoteBody = quoteBodyValid ? '' : 'Quote Body is too short';
                
                break;

            case 'quoteAuthor':

                if (value.length === 0){
                    quoteAuthorValid = true;
                    this.setState((state) => ({
                        quoteAuthor : state.username
                    }), () => {fieldValidateErrors.quoteAuthor = quoteAuthorValid ? '' : ''})
                    break;
                }
                else if (value.length <= 20) {
                    quoteAuthorValid = true
                    fieldValidateErrors.quoteAuthor = quoteAuthorValid ? '' : 'Quote Author is short long';
                    break;
                }
                else {
                    break;
                }

            default:
                break;

        }

        this.setState({
            formErrors : fieldValidateErrors, 
            quoteTitleValid : quoteTitleValid, 
            quoteBodyValid : quoteBodyValid,
            quoteAuthorValid : quoteAuthorValid,
        },    
            this.validateForm);
        
    }

     // ValidaateForm function sets the current state of the fields of the form.
    validateForm() {
        console.log(this.state.quoteTitleValid, this.state.quoteAuthorValid, this.state.quoteBodyValid )

        this.setState({
            formValid:  this.state.quoteTitleValid &&
                        this.state.quoteBodyValid && 
                        this.state.quoteAuthorValid,
                    });

    }

    showEditErrors() {
        if (!this.state.formValid) {
            //console.log('showing')
            //console.log(this.state.formValid)
            return <Alert variant="danger">{this.state.formErrors.quoteTitle} 
                                           {this.state.formErrors.quoteAuthor} 
                                           {this.state.formErrors.quoteBody}
                    </Alert>
        } 
    }


    //#endregion

    // deleteAccountModal() {
    //    this.handleClose()
    // }



    //#region Modal Handlers
        handleDeleteAccountClose (){
                this.setState({
                    deleteAccountModal : !this.state.deleteAccountModal
                })
            }

        handleEditQuoteClose () {
            this.setState({
                editQuoteModal : !this.state.editQuoteModal
            })
        }

        handleDeleteQuoteClose() {
            this.setState({
                deleteQuoteModal : !this.state.deleteQuoteModal
            })
        }
    //#endregion


    //#region Account Buttons
    logout() {
            localStorage.removeItem("beepboop")
            localStorage.removeItem('nimdAis')
            this.props.history.push({
                pathname : "/login",
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
        return <Link to='/approveQuote'>
                    <Button variant="outline-success" style={{marginLeft : 10}}>Approve Quotes
                        <Badge  variant="danger" style={{marginLeft : 5}}>{this.state.unapprovedQuotesCount}</Badge>
                    </Button>
                </Link>
        }
    }
    //#endregion

    handleSelect(selectedTab) {
        // The active tab must be set into the state so that
        // the Tabs component knows about the change and re-renders.
        this.setState({
          activeTab: selectedTab
        });
      }


    render() {
        return (

            <div className="container">
                {/* Delete Account Modal */}
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
                    <Button variant="secondary" onClick={this.handleDeleteAccountClose}>
                        Nevermind
                    </Button>
                    <Button variant="danger" onClick={this.deleteAccount}>Delete Account</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Quote Modal */}
                <Modal
                    show={this.state.deleteQuoteModal}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header>
                    <Modal.Title>Delete Quote?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete {this.state.deletingQuote.quoteTitle}? This is not reversable and will delete the quotes top score and WPM.
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleDeleteQuoteClose}>
                        Nevermind
                    </Button>
                    <Button variant="danger" onClick={this.deleteThisQuote}>Delete Quote</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Quote Modal */}
                <Modal
                    show={this.state.editQuoteModal}
                    backdrop="static"
                    keyboard={false}
                    size='xl'
                    centered

                >
                    <Modal.Header>
                        <Modal.Title>Edit Quote</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div>
                        <Alert variant="secondary">
                            <Form>
                                <Alert.Heading>
                                        <Row>
                                            <Col m="auto">

                                                <Form.Control

                                                    value={this.state.editQuote.quoteTitle}
                                                    type='text'
                                                    size='lg'
                                                    onChange={this.onChangeQuoteTitle}
                                                    name = 'quoteTitle'
                                                />
                                            </Col>
                                            <Col xs="auto"> -</Col>
                                            <Col xs="auto">

                                                <Form.Control
                                                        value={this.state.editQuote.quoteAuthor}
                                                        type='text'
                                                        style={{width : String(this.state.editQuote.quoteAuthor.length)}}
                                                        size='lg'
                                                        onChange={this.onChangeQuoteAuthor}
                                                        name = 'quoteAuthor'
                                                    />
                                            </Col>
                                        </Row>
                                </Alert.Heading>

                                <Form.Control
                                    value={this.state.editQuote.quoteBody}
                                    id = "quoteBody"
                                    name = "quoteBody"
                                    as="textarea" rows = "4"
                                    onChange={this.onChangeQuoteBody}
                                />
                            </Form>
                        </Alert>
                        {this.showEditErrors()}
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleEditQuoteClose}>
                            Nevermind
                        </Button>
                        <Button variant="success" onClick={this.saveQuote} disabled={!this.state.formValid}>
                            Save Quote
                        </Button>
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
                                <Button variant="outline-info" onClick={this.editAccount} style={{marginRight : 10}} disabled={false}>
                                    Edit Account
                                </Button>
                            </Link>

                            <Button variant="outline-warning" onClick={this.logout} style={{marginRight : 10}}>
                                Logout
                            </Button>
                            <Button variant="outline-danger" onClick={this.handleDeleteQuoteClose}>
                                Delete Account
                            </Button>                   

                            {this.approveButton()}
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <Tabs className="tabClass" activeKey={this.state.activeTab} onSelect={this.handleSelect}>
                                <Tab eventKey={1} title='Your Quotes' >
                                    <br />
                                    <div>
                                        {this.quotesComponentsList()}
                                    </div>
                                </Tab>
                                <Tab eventKey={2} title='Your Scores'> 
                                    <br />
                                    <ZingChart data={this.state.WPMChartConfig} />
                                    
                                    <ZingChart data={this.state.AccChartConfig} />
                                </Tab>
                                
                            </Tabs>
                                
                        </Col>

                    </Row>
                </Card>
                <div style={{ height : 800 }}></div>
            </div>
        )
    }
}