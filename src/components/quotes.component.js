import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TypingTest from './test.component';
import Alert, { AlertLink } from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Card from "./Card";
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
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
                    <br></br>
                    <Row>
                        <Col sm={8}>
                            <h4>Quotes</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.quotesList()}
                        </Col>
                    </Row>

                </Card>
                
            </div>
        )
    }
}