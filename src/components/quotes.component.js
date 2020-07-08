import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Card from "./Card";
import styled from 'styled-components';

import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Link } from "react-router-dom";

const SearchInput = styled.input.attrs(props => ({
    type : 'text',
    placeholder : 'Search'
    
}))`
    background: white;
    border-radius: 5px;
    border: 1px solid darkgray;
    height : 35px;
    margin-left : 80px;
    width : 200px;
    float: left;
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
                    <span>Added by: {props.quote.quoteUser}</span>
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

        this.state = {
            quotes: [],
        }
    }

    componentDidMount(){
        axios.get('http://localhost:8080/Quotes')
            .then(response => {
                this.setState({ quotes : response.data});
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    quotesList() {
        return this.state.quotes.map(function(currentQuote, i){
            return <Quote quote={currentQuote} key={i} index = {i}  />
        })
    }

    render() {
        return (
            <div className="container">
                <Card>
        
                    <Row>
                        <Col sm={8}>
                            <h4>Quotes</h4>  
                        </Col>
                        <Col sm={4}>
                            <SearchInput></SearchInput>
                            <Button variant="outline-success" style={{ float : "right"}}>
                                <svg width="1.1em" height="1.1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                </svg>
                            </Button>
                        </Col>
                        
                    </Row><br/>
                    <Row>
                        <Col>
                            {this.quotesList()}
                        </Col>
                    </Row>

                </Card>
                <br/>
                <br/>
                <br/>
            </div>
        )
    }
}