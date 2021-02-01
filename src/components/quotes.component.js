import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
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
        this.selectSort = this.selectSort.bind(this);

        this.state = {
            quotes: [],
            search : '',
            filteredQuotes : [],
            sortedQuotes : [],
            listHeight : 0
        }
    }

    componentDidMount(){
        let listHeight = document.getElementById('card')
        let APIURL = ''
        if (process.env.NODE_ENV === 'production') {
            APIURL = 'https://typingtest.jdoyle.ie'
        } else if (process.env.NODE_ENV === 'development') { 
            APIURL = 'http://localhost:8080'
        }
        axios.get(APIURL + '/quotes/approved')
            .then(response => {
                this.setState({ quotes : response.data,
                                filteredQuotes : response.data,
                                listHeight : listHeight
                });
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
       
        let search = document.getElementById('searchBar').value

        // filter funtion that works so amazingly well without needing more requests
        let filteredQuotes = this.state.filteredQuotes.filter(
            (quote) => {
                return  quote.quoteTitle.toLowerCase().indexOf(search) !== -1 ||
                        quote.quoteAuthor.toLowerCase().indexOf(search) !== -1 || 
                        quote.quoteUser.indexOf(search) !== -1;
            }
        )

        this.setState({
            filteredQuotes : filteredQuotes
        })
    }

    selectSort(e){


        let value = e.target.value

        console.log(document.getElementById('card').offsetHeight)
        let quotes = this.state.filteredQuotes
        let sortedQuotes = quotes
        console.log(quotes)
        switch (value) {

            case 'a-z':
                sortedQuotes = quotes.sort((a,b) => (a.quoteTitle > b.quoteTitle) ? 1 : -1) 
                break;

            case 'z-a': 
                sortedQuotes = quotes.sort((a,b) => (a.quoteTitle < b.quoteTitle) ? 1 : -1) 
                break;

            case 'rating':
                sortedQuotes = quotes.sort((a,b) => (a.quoteScore < b.quoteScore) ? 1 : -1)
                break;

            case 'score':
                sortedQuotes = quotes.sort((a,b) => (a.highWPMScore < b.highWPMScore) ? 1 : -1)
                break;
        }

        this.setState({
            filteredQuotes : sortedQuotes
        }) 
    }


    render() {
       
        return (
            <div className="container">
                <Card id='card'>
                    <Row>
                        <Col sm={7}>
                            <h4>Quotes</h4>  
                        </Col>
                        <Col sm={2}>
                            <FormControl as="select" size="sm" onChange={this.selectSort}>
                                <option value="a-z">A-Z</option>
                                <option value="z-a">Z-A</option>
                                <option value="rating">Rating</option>
                                <option value="score">High Score</option>
                            </FormControl>
                        </Col>
                        <Col sm={3}>
                            <SearchInput id="searchBar"  onChange={this.search}></SearchInput>
                        </Col>
                        
                    </Row><br/>
                    <Row>
                        <Col>
                            {this.quotesList(this.state.filteredQuotes)}
                        </Col>
                    </Row>

                </Card>
                <div style={{height : 800}}> </div>
            </div>
        )
    }
}