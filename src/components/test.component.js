import React, { Component, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse'



export default class TypingTest extends Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.compare = this.compare.bind(this);
        this.resetTest = this.resetTest.bind(this);
        this.endTest = this.endTest.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.calculateWPM = this.calculateWPM.bind(this);



        this.state = {
            quote_name: 'Test Quote Title',
            quote_body : 'Irishmen and Irishwomen: In the name of God and of the dead generations from which she receives her old tradition of nationhood, Ireland, through us, summons her children to her flag and strikes for her freedom.',
            user_input : '',
            quote_words: [],
            char_array: [],
            current_quote_char: '',
            typed_chars: '',
            current_quote_word: '',
            count: 0,
            error_count : 0,
            total_error_count : 0,
            input_disabled : false,
            quote_left : '',
            quote_right : '',
            quote_error : '',
            quote_start : '',
            quote_class : 'quote-current',
            tInterval : '', 
            minutes : 0,
            seconds : 0,
            netWPM : 0,
            accuracy : 0

        }
    }

    componentDidMount () {
        let body = this.state.quote_body;
        let words = [];
        let chars = [];

        words = body.split(" ");
        chars = Array.from(body);

        this.setState((state) => ({
            quote_words : words,
            current_quote_word : words[state.count],
            char_array : chars,
            current_quote_char : chars[state.count],
            quote_start : state.quote_body
        })) 
    }

    startTimer () {
        let seconds = this.state.seconds + 1;

        this.setState((state) => ({
            seconds : seconds,
        }))   
    }

    // Called whenever the user input is changed
    // Sets the state of user_input to the user's input and calls compare with the current word from state.
    onInputChange (e) {
        if (e.keyCode !== 8 && e.location === 0) {

            if (this.state.count === 0) {
                //Start timer
                
                this.setState ({
                    quote_start : '',
                    tInterval : setInterval(this.startTimer, 1000),
                })

            }
            this.setState({
                user_input : e.key
            }, () => this.compare(this.state.current_quote_char))
        }
        // Backspace conditions for changing the current char left and right spans
        else if (e.keyCode === 8 && this.state.quote_error !== '' && this.state.error_count  > 0) {
            if (this.state.error_count > 0) {
                this.setState ((state) => ({
                    error_count : state.error_count --,
                    count : state.count - 1,
                    current_quote_char : state.char_array[state.count -1],
                    quote_left : state.typed_chars.slice(0, -1),
                    typed_chars : state.typed_chars.slice(0, -1),
                    quote_right :  state.char_array.slice(state.count, state.char_array.length)
                }))      
            }
            else {
                this.setState ((state) => ({
                    count : state.count - 1,
                    current_quote_char : state.char_array[state.count -1],
                    quote_left : state.typed_chars.slice(0, -1),
                    typed_chars : state.typed_chars.slice(0, -1),
                    quote_right :  state.char_array.slice(state.count , state.char_array.length)
                }), () => console.log(this.state.quote_left))      
            }
        }
    }

    // Called in onInputChange
    // Takes the current word to be typed from state
    // Compares it to the user input
    // Checks the if the word count is equal to the length of the quote_words array; if it is the test is over and endTest() is called.
    // If it is not the state of the current word is changed, the count is incremented and the user_input is set back to empty
    compare (current_word) {
        if (current_word === this.state.user_input) {
            console.log("match");
            if (this.state.count >= this.state.char_array.length -1) {
                this.setState((state) => ({
                    typed_chars: state.typed_chars + state.user_input
                }), () => this.endTest())
            }
            else {
                this.setState((state) => ({
                    //current_quote_word : this.state.quote_words[this.state.count],
                    current_quote_char : state.char_array[state.count + 1],
                    count: state.count + 1,
                    quote_class : 'quote-current',
                    typed_chars: state.typed_chars + state.user_input,
                    quote_left : state.typed_chars + state.user_input,
                    quote_right : state.char_array.slice(state.count+2, state.char_array.length),
                    user_input : '',
                    quote_error: '',

                }));  
            }
                document.getElementById('input').value = '';
        }
        else {

            console.log(this.state.typed_chars + this.state.char_array[this.state.count+1])
            this.setState((state) => ({
                //quote_error : state.char_array[state.count+1],
                current_quote_char : state.char_array[state.count + 1],
                count: state.count + 1,
                quote_class : 'quote-error',
                typed_chars : state.typed_chars + state.char_array[state.count],
                quote_error : state.current_quote_char,
                quote_right : state.char_array.slice(state.count +2, state.char_array.length),
                error_count : state.error_count + 1,
                total_error_count : state.total_error_count + 1
            }), () => console.log('Error count:' + this.state.error_count))
        }
    }

    //Called whenever the reset button is pressed
    //Resets the test by resetting the state to default.
    resetTest () {

        let body = this.state.quote_body;
        let words = [];
        let chars = [];

        words = body.split(" ");
        chars = Array.from(body);

        this.setState((state) => ({
            quote_name: 'Test Quote Title',
            quote_body : 'This is a test quote that I am hardcoding to make web app',
            quote_words : words,
            current_quote_word : words[state.count],
            char_array : chars,
            current_quote_char : chars[state.count],
            quote_start : state.quote_body,
            user_input : '',
            current_quote_char : '',
            current_quote_word: '',
            typed_chars : '',
            error_count : 0,
            total_error_count : 0,
            count: 0,
            }),
            () => {
                console.log(this.state)
            })
            console.log(this.state)
    }

    //Called when the end of the test is reached in compare()
    // Calculates word per minute
    endTest () {
       // console.log('Test is over!')
        clearInterval(this.state.tInterval);
        console.log(this.state.error_count)
        let correctChars = this.state.char_array.length - this.state.total_error_count
        this.setState((state) => ({
            error_count : state.error_count,
            accuracy : Math.ceil((correctChars / state.char_array.length)*100),
            input_disabled : true,
            current_quote_char : '',
            quote_left : state.quote_body,
            minutes : 0,
            seconds : 0,
            netWPM : Math.ceil(this.calculateWPM()),
        }))
    }

    calculateWPM () {
       
        let seconds = this.state.seconds;
        let minutes = seconds/60
        let errors = this.state.error_count;

        let typedEntries = this.state.typed_chars.length;

        let grossWPM = (typedEntries/5) / minutes
        let netWPM = grossWPM - (errors/minutes)


        return netWPM
    }

    render() {
        return (
            <div className="container">
                <h4>{this.state.quote_name}</h4>

                <Alert variant="secondary">
                     <span className="quote-start">{this.state.quote_start}</span>
                    <span className="quote-left">{this.state.quote_left}</span>
                    <span className={this.state.quote_class}>{this.state.current_quote_char}</span>
                    <span className="quote-right">{this.state.quote_right}</span>
                </Alert>    

                <h5>Current Character: {this.state.current_quote_char}</h5>
                <br></br>   
                <input type="text"  onKeyDown={this.onInputChange} id='input' disabled={this.state.input_disabled}></input>
                <button onClick={this.resetTest} style={{marginLeft: 10}} className="btn btn-secondary">
                    <svg className="bi bi-arrow-repeat" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clipRule="evenodd"/>
                    </svg>
                </button>
                <br></br>
                <br></br>
                <Collapse in={this.state.input_disabled}>
                    <div id="results">
                        <Alert variant="success">
                            <Alert.Heading>Well Done!</Alert.Heading>
                            <p>
                                Here are your results:<br></br>
                                WPM : {this.state.netWPM} <br></br>
                                accuracy : {this.state.accuracy}%
                            </p>
                        </Alert>
                    </div>          
                </Collapse>
                
            </div>
        )
    }
}