import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Card from "./Card";
import styled from 'styled-components';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const SearchInput = styled.input.attrs(props => ({
    type : 'text',
    placeholder : ' Search: Title, Author, User'
    
}))`
    background: white;
    border-radius: 5px;
    border: 1px solid darkgray;
    height : 35px;
    margin-left : 80px;
    width : 230px;
    float: right;
    :: disabled
`

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
                    <span>Added by: <Alert.Link>{props.quote.quoteUser}</Alert.Link></span>
                    <span style={{marginLeft : 10}}>Approved : {String(props.quote.quoteApproved)}</span> 
                    <span style={{marginLeft : 10}}>Rating : {props.quote.quoteScore}</span> 
                    <span style={{marginLeft : 10}}>High Score : {props.quote.highWPMScore}WPM {props.quote.highAccScore}% Accuracy</span>
                </Col>
                <Col sm={4}>
                    <div style={{float : 'right'}}>

                        <Button variant="success" style={{ marginRight : 5}} onClick={props.approve}  >
                            Approve
                        </Button>
                        <Button variant="danger" onClick={props.del}>
                            Delete
                        </Button>
                    </div>
                </Col>
            </Row>    
        </Alert>
        <br></br>
    </div>  
)

export default class QuoteList extends Component {

    constructor(props){
        super(props)

        this.search = this.search.bind(this);
        this.quotesList = this.quotesList.bind(this);
        this.approveQuote = this.approveQuote.bind(this);
        this.deleteQuote = this.deleteQuote.bind(this);
        this.noQuotes = this.noQuotes.bind(this);

        this.state = {
            quotes: [],
            search : '',
            token : '',
            APIURL : ''
        }
    }

    componentDidMount(){
        let token = localStorage.getItem('beepboop');
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
        axios.get(APIURL + '/quotes/unapproved', {headers : {'auth-token' : token}})
            .then(response => {
                this.setState({ 
                    quotes : response.data,
                    token : localStorage.getItem('beepboop')
                });

            })
            .catch(function (err) {
                console.log(err);
            });
    }

    quotesList(quotesList) {
        let approve = this.approveQuote;
        let del = this.deleteQuote;
        return quotesList.map(function(currentQuote, i, ){
            return <Quote quote={currentQuote} key={i} index = {i}  approve={() => approve(currentQuote)} del={() => del(currentQuote)}/>
        })
    }

    search() {
        this.setState({
            search : document.getElementById('searchBar').value
        })
        
    }

    approveQuote(currentQuote) {
        console.log(currentQuote)
        axios.post(this.state.APIURL + '/quotes/approve', currentQuote, { headers : {'auth-token' : this.state.token}})
        .then(res => {
            console.log(res.data)
            this.setState({
                quotes : []
            })
        })
        console.log(currentQuote.quoteApproved)

    }

    deleteQuote() {
        console.log('Delete')
    }

    noQuotes() {
        if (this.state.quotes.length === 0) {
            return <span>No quotes to approve!</span> 
        }
    }
   

    

    render() {
        // filter funtion that works so amazingly well without needing more requests
        let filteredQuotes = this.state.quotes.filter(
            (quote) => {
                return  quote.quoteTitle.toLowerCase().indexOf(this.state.search) !== -1 ||
                        quote.quoteAuthor.toLowerCase().indexOf(this.state.search) !== -1 || 
                        quote.quoteUser.indexOf(this.state.search) !== -1;
            }
        )
        return (
            <div className="container">
                <Card>
                    <Row>
                        <Col sm={8}>
                            <h4> Approve Quotes</h4>  
                            
                        </Col>
                        <Col sm={4}>
                            <SearchInput id="searchBar"  onChange={this.search}></SearchInput>
                        </Col>
                        
                    </Row><br/>
                    <Row>
                        <Col>
                            <Link to='/profile'>
                                <Button variant="info">Back to Profile</Button>
                            </Link>
                        </Col> 
                    </Row><br/>
                    <Row>
                        <Col>
                            {this.quotesList(filteredQuotes)}
                            {this.noQuotes()}
                        </Col>
                    </Row>

                </Card>
                <div style={{ height : 800}}></div>

            </div>
        )
    }
}