import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import axios from 'axios';
import Card from './Card'


const TestInput = styled.input.attrs(props => ({
    type : 'text',
    
}))`
    background: white;
    border-radius: 5px;
    border: 1px solid darkgray;

    :: disabled
`

export default class TypingTest extends Component {

    constructor(props) {
        super(props);
        
        this.onInputChange = this.onInputChange.bind(this);
        this.compare = this.compare.bind(this);
        this.resetTest = this.resetTest.bind(this);
        this.endTest = this.endTest.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.calculateWPM = this.calculateWPM.bind(this);
        this.calculateHighScore = this.calculateHighScore.bind(this);
        this.backspace = this.backspace.bind(this);
        this.escFunction = this.escFunction.bind(this);
        this.debugToggle = this.debugToggle.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
        this.newTest = this.newTest.bind(this);

        this.state = {
            quote: [],
            //The name of the quote
            quote_Title: '',
            // The text body of the quote
            quote_body : '',
            quote_author : '',
            user_input : '',
            // An array of every word in the quote not currently used but might be useful later
            quote_words: [],
            // An array of every character in the quote including spaces
            char_array: [],
            // String that contains the next character to be typed
            current_quote_char: '',
            // String that holds what the user types if they are correct but if it is not correct it is filled correctly by char_array
            typed_chars: '',
            // string that contains the current work to be typed not currently used but might be useful later
            current_quote_word: '',
            // counter that keeps track of the number of user inputs excluding backspace
            count: 0,
            // counter that keeps track of errors, can be decremented if the user corrects their error
            error_count : 0,
            // a total error counter that does not decrement
            total_error_count : 0,
            // boolean to disable input to the text box and display results when the test is over, false == test not over, true == test over
            input_disabled : false,
            // String that contains every thing that has been typed or that the user has passed
            quote_left : '',
            // String that contains everything the user has left to type
            quote_right : '',
            // String that contains correct characters that the user has gotten wrong errors the user has typed
            quote_error : '',
            // The quote placeholder for before the test starts is emptied after the test starts
            quote_start : '',
            // error array that conatins the errors the user has typed
            err_arr : '',
            // string that contains the css class of the current character span so it can be change when there is an error or not
            quote_class : 'quote-current',
            // Interval to time the user
            tInterval : '', 
            // number that keeps track of the seconds that have passed since the test started
            seconds : 0,
            // The net words per minute
            netWPM : 0,
            // Accuracy %
            accuracy : 0,
            // Highscores
            highestAcc : 0, 
            highestWPM : 0,

            //api url
            apiUrl : '',

            debug : false
        }
    }

    componentDidMount () {
        let query = '';
        if (this.props.location.state != null) {
            query = this.props.location.state.id
        }
        else {
            query = 'random';
        }
        let APIURL = ''
        // Check if in dev or production environment
        if (process.env.NODE_ENV === 'production') {
            this.setState((state) => ({
                apiUrl : 'https://jdoyle.ie',
            }))
            APIURL = 'https://jdoyle.ie'
        } else if (process.env.NODE_ENV === 'development') {
            this.setState((state) => ({
               apiUrl : 'http://localhost:8080',
            }))
            APIURL = 'http://localhost:8080'
        }
        // get quote from database and update state
        axios.get(APIURL +'/quotes/'+query)
            .then(response => {
                this.setState((state) => ({ 
                    quote_Title : response.data.quoteTitle,
                    quote_body : response.data.quoteBody,
                    char_array : Array.from(response.data.quoteBody),
                    current_quote_char : Array.from(response.data.quoteBody)[0],
                    quote_start : response.data.quoteBody,
                    quote_author : response.data.quoteAuthor,
                }))
            })
            .catch(function (err) {
                console.log(err);
            })

        // add eventListener that checks if the esc key has been pressed on every keydown
        document.addEventListener("keydown", this.escFunction, false);
        
    }


     
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    // startTimer function that is called every second by setInterval in onInputChance() 
    // increments seconds by 1 and sets the state.
    startTimer () {
        let seconds = this.state.seconds + 1;
        this.setState((state) => ({
            seconds : seconds,
        }))
    }

    // escFunction that handles when the escape key is pressed
    escFunction(event){
        if(event.keyCode === 27) {
          this.resetTest();
        }
    }

    // Function that toggles the debug output
    debugToggle() {
        this.setState((state) => ({
            debug : !state.debug
        })) 
    }

    // Called whenever the user input is changed
    // Sets the state of user_input to the user's input and calls compare with the current word from state.
    onInputChange (e) {
        // edge case if user ends test with error to just end the test if the total number of entries == the quote len.
        if (this.state.count === this.state.char_array.length) {
            this.endTest();
            console.log('testing jenkins')
            return
        }

        // if the key pressed is not backspace and is in the general keys location 0
        if (e.keyCode !== 8 && e.location === 0) {

            // if the user has started typing yet
            if (this.state.count === 0) {
                //Start timer
                let interval = setInterval(this.startTimer, 1000)
                this.setState ((state) => ({
                    quote_start : '',
                    seconds : 0,
                    tInterval : interval      
                }))
            }
            // update the current user_input state and call compare function
            this.setState({
                user_input : e.key
            }, () => this.compare(this.state.current_quote_char))
        }
        // Backspace conditions for changing the current char, left and right spans     
        else if (e.keyCode === 8 && this.state.err_arr !== '' && this.state.error_count  > 0) {
            // if there are errors and the user presses backspace reduce the error count
            if (this.state.error_count > 0) {
                this.setState ((state) => ({
                    error_count : state.error_count -1,
                }), () => this.backspace())      
            }
            else {
                this.backspace();
            }
        }
    }

    // backspace function that handles when the user enters a backspace into the input box
    backspace () {
        this.setState ((state) => ({
            err_arr : state.err_arr.slice(0, state.err_arr.length-1),
            count : state.count - 1,
            current_quote_char : state.char_array[state.count -1],
            quote_left : state.typed_chars.slice(0, state.typed_chars.length - state.err_arr.length),
            typed_chars : state.typed_chars.slice(0, -1),
            quote_right :  state.char_array.slice(state.count , state.char_array.length)
        }))      
    }

    // Called in onInputChange
    // Takes the current word to be typed from state
    // Compares it to the user input
    // Checks the if the word count is equal to the length of the quote_words array; if it is the test is over and endTest() is called.
    // If it is not the state of the current word is changed, the count is incremented and the user_input is set back to empty
    compare (current_char) {
        if (current_char === this.state.user_input) {
            console.log("match");
            if (this.state.count >= this.state.char_array.length -1) {
                this.setState((state) => ({
                    typed_chars: state.typed_chars + state.user_input
                }), () => this.endTest())
            }
            else {
                this.setState((state) => ({
                    current_quote_char : state.char_array[state.count + 1],
                    count: state.count + 1,
                    typed_chars: state.typed_chars + state.user_input,
                    quote_right : state.char_array.slice(state.count+2, state.char_array.length),
                    user_input : '',
                    quote_left : state.typed_chars + state.user_input,
                    err_arr : '',
                    quote_class : 'quote-current',
                }));  
            }
            document.getElementById('input').value = '';
        }
        else {
            this.setState((state) => ({
                err_arr : state.err_arr + state.char_array[state.count],
                current_quote_char : state.char_array[state.count + 1],
                count: state.count + 1,
                quote_class : 'quote-warning',
                typed_chars : state.typed_chars + state.char_array[state.count],
                quote_error :  state.err_arr,
                quote_right : state.char_array.slice(state.count +2, state.char_array.length),
                error_count : state.error_count + 1,
                total_error_count : state.total_error_count + 1,
            }))
        }
    }

    // Called by newTestBtn 
    // queries the db for a random quote and updates the state
    // then calls resettest to reset other counters and timers
    newTest () {
        // get quote from database and update state
        axios.get(this.state.apiUrl + '/quotes/random')
            .then(response => {
                this.setState((state) => ({ 
                    quote_Title : response.data.quoteTitle,
                    quote_body : response.data.quoteBody,
                    char_array : Array.from(response.data.quoteBody),
                    current_quote_char : Array.from(response.data.quoteBody)[0],
                    quote_start : response.data.quoteBody,
                    quote_author : response.data.quoteAuthor
                }))
            })
            .catch(function (err) {
                console.log(err);
            })
        this.resetTest()
    }

    //Called whenever the reset button is pressed
    //Resets the test by resetting the state to default.
    resetTest () {
        let body = this.state.quote_body;
        let words = [];
        let chars = [];
        words = body.split(" ");
        chars = Array.from(body);
        clearInterval(this.state.tInterval);
        document.getElementById('input').value = '';
        document.getElementById('input').focus();

        this.setState((state) => ({
            quote_Title: state.quote_Title,
            quote_body : state.quote_body, 
            quote_words : words,
            current_quote_word : words[0],
            char_array : chars,
            quote_start : state.quote_body,
            current_quote_char : state.char_array[0],
            err_arr : '',
            user_input : '',
            quote_left : '',
            quote_right : '',
            typed_chars : '',
            error_count : 0,
            quote_class : 'quote_current',
            quote_error : '',
            total_error_count : 0,
            count: 0,
            seconds : 0,
            input_disabled : false,
        }))
    }

    // Called when the end of the test is reached in compare()
    // Calculates word per minute
    endTest () {
        clearInterval(this.state.tInterval);
        let correctChars = this.state.char_array.length - this.state.total_error_count;

        let lastWPM = this.state.netWPM;
        let lastAccuracy = this.state.accuracy;
        
        document.activeElement.blur();
        document.getElementById('input').focus();
        this.setState((state) => ({
            error_count : state.error_count,
            accuracy : Math.ceil((correctChars / state.char_array.length)*100),
            input_disabled : true,
            current_quote_char : '',
            quote_left : state.quote_body,
            seconds : 0,
            err_arr : '',
            netWPM : Math.ceil(this.calculateWPM()),
        }), () => this.calculateHighScore(lastAccuracy, lastWPM))
    }

    // Function that updates the user's high score is the latest score was better than the last replace the scores
    calculateHighScore (lastAccuracy, lastWPM) {
        let latestAccuracy = this.state.accuracy;
        let latestWPM = this.state.netWPM;

        if (latestWPM > lastWPM) {
            this.setState({
                highestAcc : latestAccuracy,
                highestWPM : latestWPM
            })
        }
    }

    // calculateWPM function calculates the user's WPM and returns the netWPM
    calculateWPM () {
        let seconds = this.state.seconds;
        let minutes = seconds/60;
        let errors = this.state.error_count;
        let typedEntries = this.state.typed_chars.length;
        let grossWPM = (typedEntries/5) / minutes;
        let netWPM = grossWPM - (errors/minutes);
        // Now do it all in one line for Duggan
        //netWPM = ((this.state.typed_chars.length/5) / (this.state.seconds/60)) - (this.state.error_count/(this.state.seconds/60))
        return netWPM
    }

    // function to render button tooltips
    renderTooltip(props) {
        if (props.popper.state != null) {
            //console.log(props.popper.state.elements)

            if (props.popper.state.elements.reference.id === 'restartBtn') {
                return (
                    <Tooltip id="button-tooltip" {...props}>
                        Restart Test
                    </Tooltip>
                );
            } else if (props.popper.state.elements.reference.id === 'newTestBtn') {
                return (
                    <Tooltip id="button-tooltip" {...props}>
                        Start New Test
                    </Tooltip>
                );
            } else if (props.popper.state.elements.reference.id === 'debugBtn') {
                return (
                    <Tooltip id="button-tooltip" {...props}>
                        Show debug Info
                    </Tooltip>
                )
            } 
        }
        return  (
            <Tooltip {...props}>
                tes
            </Tooltip>
        )     
    }

    render() {
        return (
            <div className="container">
                <Card>
                   
                    
                        <Row>
                            <Col sm={8}>
                                <h4>{this.state.quote_Title} - {this.state.quote_author}</h4>
                                <Alert variant="secondary">       
                                    <span className="quote-left">{this.state.quote_left}</span>
                                    <span className="quote-error">{this.state.err_arr}</span>
                                    <span className={this.state.quote_class}>{this.state.current_quote_char}</span>
                                    <span className="quote-start">{this.state.quote_start.slice(1)}</span>
                                    <span className="quote-right">{this.state.quote_right}</span>
                                </Alert>    
                            </Col>
                            <Col sm={4}>
                                <h4>High Scores</h4>
                                <Alert variant="info">
                                    <span>
                                        WPM : {this.state.highestWPM} <br></br>
                                        Accuracy : {this.state.highestAcc}% <br></br>
                                    </span>       
                                </Alert>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>Current Character: {this.state.current_quote_char}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={8}>
                                <TestInput  onKeyDown={this.onInputChange} id='input' disabled={this.state.input_disabled}/>
                                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip} name="restartOverlay">
                                    <Button onClick={this.resetTest} style={{marginLeft: 10}} variant="secondary" id="restartBtn">
                                        <svg className="bi bi-arrow-repeat" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clipRule="evenodd"/>
                                            <path fillRule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clipRule="evenodd"/>
                                        </svg>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip}>
                                    <Button onClick={this.newTest} variant="info" style={{marginLeft : 10}} id="newTestBtn" name="newTestBtn">
                                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                                            <path fillRule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
                                        </svg>
                                    </Button>
                                </OverlayTrigger>
                                
                            </Col>
                            <Col sm={4}>
                                <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip}>
                                    <Button onClick={this.debugToggle} variant="outline-warning" style={{float : "right"}} id="debugBtn" name="debugBtn">
                                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-bug" fill="currentColor" xmlns="http://www.w3.org/2000/svg" >
                                            <path fillRule="evenodd" d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6H4a3.99 3.99 0 0 1 1.333-2.982A3.983 3.983 0 0 1 8 2c1.025 0 1.959.385 2.666 1.018A3.989 3.989 0 0 1 12 6z"/>
                                        </svg>
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                        </Row><br></br>
                        
                        <Row> 
                            <Col sm={8}>
                                <Collapse in={this.state.input_disabled}>
                                    <div id="results">
                                        <Alert variant="success">
                                            <Alert.Heading>Well Done!</Alert.Heading>
                                                <p>
                                                    Here are your results:<br></br>
                                                    WPM : {this.state.netWPM} <br></br>
                                                    Accuracy : {this.state.accuracy}% <br></br>
                                                    Errors : {this.state.total_error_count}<br></br>
                                                    Corrected Errors : {this.state.error_count}
                                                </p>
                                        </Alert>
                                    </div>          
                                </Collapse>
                            </Col>
                            <Col sm={4}>
                                <Collapse in={this.state.debug}>
                                    <div>
                                        <Alert variant="warning">
                                            <Alert.Heading>Debug</Alert.Heading>
                                            <p>
                                                Error array : {this.state.err_arr}<br></br>
                                                quote length : {this.state.char_array.length}<br></br>
                                                Input count : {this.state.count}<br></br>
                                                Error Count : {this.state.error_count}<br></br>
                                                Total Error Count : {this.state.total_error_count}<br></br>
                                                Previous character : {this.state.char_array[this.state.count-1]}<br></br>
                                                Current character : {this.state.char_array[this.state.count]}<br></br>
                                                Next character : {this.state.char_array[this.state.count+1]}<br></br> 
                                                Quote left : {this.state.quote_left}<br></br>
                                                Quote green : {this.state.current_quote_char}<br></br>
                                                Quote right : {this.state.quote_right}<br></br>
                                                Quote error : {this.state.quote_error}
                                            </p>
                                        </Alert>
                                    </div>
                                </Collapse>      
                            </Col>
                        </Row> 
                </Card>    
                <div style={{ height : 800}}></div>
            </div>  
        )
    }
}