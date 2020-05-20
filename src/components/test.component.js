import React, { Component } from 'react';
import Highlighter from 'react-highlight-words';


export default class TypingTest extends Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.compare = this.compare.bind(this);
        this.resetTest = this.resetTest.bind(this);
        this.endTest = this.endTest.bind(this);


        this.state = {
            quote_name: 'Test Quote Title',
            quote_body : 'This is a test quote that I am hardcoding to make this web app',
            user_input : '',
            quote_words: [],
            char_array: [],
            current_quote_char: '',
            typed_chars: '',
            current_quote_word: '',
            bg_colour: 'white',
            count: 0,
            error_count : 0,
            input_disabled : false,
            quote_left : '',
            quote_right : '',
            quote_error : '',
            quote_start : '',

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

    // Called whenever the user input is changed
    // Sets the state of user_input to the user's input and calls compare with the current word from state.
    onInputChange (e) {

        if (this.state.count === 0) {
            //Start timer

            this.setState ({
                quote_start : ''
            })
        }


        this.setState({
            user_input : e.target.value
        }, () => this.compare(this.state.current_quote_char))
    }

 
    // Called in onInputChange
    // Takes the current word to be typed from state
    // Compares it to the user input
    // Checks the if the word count is equal to the length of the quote_words array; if it is the test is over and endTest() is called.
    // If it is not the state of the current word is changed, the count is incremented and the user_input is set back to empty
    compare (current_word) {
        
        if (current_word === this.state.user_input) {
            console.log("match");
            console.log('count: ' + this.state.count);
            console.log('charrarry length: ' + this.state.char_array.length)
            if (this.state.count === this.state.char_array.length -1) {
                this.setState((state) => ({
                    typed_chars: state.typed_chars + state.user_input
                }), () => this.endTest())
            }
            else {
                this.setState((state) => ({
                    //current_quote_word : this.state.quote_words[this.state.count],
                    current_quote_char : state.char_array[state.count + 1],
                    count: state.count + 1,
                    bg_colour : 'white',
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
            //let errcount = this.state.error_count/2
            let errorPos = this.state.count;
            this.setState((state) => ({
                //bg_colour : '#ff6666',

                quote_error : state.char_array[state.count+1],
                current_quote_char : '',
                count: state.count + 1,
                typed_chars : state.typed_chars + state.char_array[state.count+1],
                quote_left : state.typed_chars,
                quote_right : state.char_array.slice(state.count +2, state.char_array.length),
                error_count : state.error_count + 1
            }), () => console.log('Error count:' + this.state.error_count))
        }
    }

    //Called whenever the reset button is pressed
    //Resets the test by resetting the state to default.
    resetTest () {
        this.setState({
            quote_name: 'Test Quote Title',
            quote_body : 'This is a test quote that I am hardcoding to make web app',
            user_input : '',
            current_quote_char : '',
            current_quote_word: '',
            typed_chars : '',
            error_count : 0,
            bg_colour: 'white',
            count: 0,},
            () => {
                console.log(this.state)
            })
            console.log(this.state)
    }

    //Called when the end of the test is reached in compare()
    // Calculates word per minute
    endTest () {
        console.log('Test is over!')
        //this.resetTest();
        console.log('End error count before dividing : ' + this.state.error_count)
        let errcount = this.state.error_count/2 
        this.setState((state) => ({
            error_count : state.error_count/2,
            input_disabled : true,
            //current_quote_char : 'TEST FINISHED'
        }), () => console.log('end error count: ' + this.state.error_count))

        
    }

    render() {
        return (
            <div className="container">
                <h4>{this.state.quote_name}</h4>

                    
                <div>
                    <span className="quote-start">{this.state.quote_start}</span>
                    <span className="quote-left">{this.state.quote_left}</span>
                    <span className="quote-current">{this.state.current_quote_char}</span>
                    <span className="quote-error">{this.state.quote_error}</span>
                    <span className="quote-right">{this.state.quote_right}</span>
                </div>   

                {/* <Highlighter 
                highlightClassName="HighlightClass"
                searchWords={[this.state.typed_chars]}
                autoEscape={true}
                textToHighlight={this.state.quote_body}
                highlightStyle={{backgroundColor : "lightgreen"}}
                activeIndex={1}
                caseSensitive={true}
                /> */}
                <h5>Current Character: {this.state.current_quote_char}</h5>
                <br></br>   
                <input type="text" onChange={this.onInputChange} id='input' style={{backgroundColor : this.state.bg_colour}} disabled={this.state.input_disabled}></input>
                <button onClick={this.resetTest} style={{marginLeft: 10}} className="btn btn-light">
                    <svg className="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clipRule="evenodd"/>
                    </svg>
                </button>
            </div>
        )
    }
}