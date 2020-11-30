import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Card from "./Card";
import styled from 'styled-components';
import { Link } from "react-router-dom";

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
                    <span style={{marginLeft : 10}}>Rating : {props.quote.quoteScore}</span>
                    <span style={{marginLeft : 10}}>High Score : {props.quote.highWPMScore}WPM {props.quote.highAccScore}% Accuracy</span>

                </Col>
                <Col sm={4}>
                    <div style={{float : 'right'}}>
                        <Alert.Link  variant="outline-seconary">
                            Suggest Edit
                        </Alert.Link>
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

        this.state = {
            quotes: [],
            search : ''
        }
    }

    componentDidMount(){
        let APIURL = ''
        if (process.env.NODE_ENV === 'production') {
            APIURL = 'https://typingtest.jdoyle.ie'
        } else if (process.env.NODE_ENV === 'development') { 
            APIURL = 'http://localhost:8080'
        }
        axios.get(APIURL + '/quotes/approved')
            .then(response => {
                this.setState({ quotes : response.data});
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    quotesList(quotesList) {
        return quotesList.map(function(currentQuote, i){
            return <Quote quote={currentQuote} key={i} index = {i}  />
        })
    }

    search() {
        this.setState({
            search : document.getElementById('searchBar').value
        })
        
    }

    

    render() {
        // filter funtion that works so amazingly well without needing more requests
        let filteredQuotes = fthis.state.quotes.ilter(
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
                            <h4>Quotes</h4>  
                        </Col>
                        <Col sm={4}>
                            <SearchInput id="searchBar"  onChange={this.search}></SearchInput>
                        </Col>
                        
                    </Row><br/>
                    <Row>
                        <Col>
                            {this.quotesList(filteredQuotes)}
                        </Col>
                    </Row>

                </Card>
                <div style={{ height : 800}}></div>

            </div>
        )
    }
}