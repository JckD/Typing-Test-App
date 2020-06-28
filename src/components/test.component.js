import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import keySound from '../assets/cherry-mx-blue.mp3';
import Sound from 'react-sound';



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


        this.state = {
            //The name of the quote
            quote_name: 'Phoblacht Na hÉireann',
            // The text body of the quote
            quote_body : 'This is the day you will always remember as the day you almost caught Captain Jack Sparrow.',
            // What the user inputs into the text input
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
            // Playing status of the key sounds currently not in use
            soundStatus : Sound.status.STOPPED,

            debug : false
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
            char_array : Array.from(state.quote_body),
            current_quote_char : chars[0],
            quote_start : state.quote_body
        })) 

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
        this.setState({
            soundStatus : Sound.status.PLAYING
        })

        if (this.state.count >= this.state.char_array.length) {
            this.endTest();
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
                    error_count : state.error_count --,
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
        }), () => console.log(this.state.quote_left))      
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
                    //current_quote_word : this.state.quote_words[this.state.count],
                    current_quote_char : state.char_array[state.count + 1],
                    count: state.count + 1,
                    quote_class : 'quote-current',
                    typed_chars: state.typed_chars + state.user_input,
                    quote_left : state.typed_chars + state.user_input,
                    quote_right : state.char_array.slice(state.count+2, state.char_array.length),
                    user_input : '',
                    //quote_error: '',
                    err_arr : ''

                }));  
            }
                document.getElementById('input').value = '';
        }
        else {

            console.log(this.state.typed_chars + this.state.char_array[this.state.count+1])

            // check the length of the current stat.count aginst the length of the quote to stop 'undefined' being injected into error array
            if (this.state.count >= this.state.char_array.length) {
                // if the length of the character array has been met 

                this.setState((state) => ({
                    //quote_error : state.char_array[state.count+1],
                    current_quote_char : state.char_array[state.count + 1],
                    err_arr : state.err_arr,
                    count: state.count + 1,
                    quote_class : 'quote-warning',
                    typed_chars : state.typed_chars + state.char_array[state.count],
                    quote_error : state.err_arr,
                    quote_right : state.char_array.slice(state.count +2, state.char_array.length),
                    error_count : state.error_count + 1,
                    total_error_count : state.total_error_count + 1,
                
                }))
            }
            else {

                this.setState((state) => ({
                    //quote_error : state.char_array[state.count+1],
                    current_quote_char : state.char_array[state.count + 1],
                    err_arr : state.err_arr + state.char_array[state.count],
                    count: state.count + 1,
                    quote_class : 'quote-warning',
                    typed_chars : state.typed_chars + state.char_array[state.count],
                    quote_error : state.err_arr,
                    quote_right : state.char_array.slice(state.count +2, state.char_array.length),
                    error_count : state.error_count + 1,
                    total_error_count : state.total_error_count + 1,
                
                }), () => console.log(this.state.err_arr))
            }
            
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
        clearInterval(this.state.tInterval);
        document.getElementById('input').value = '';

        document.getElementById('input').focus();

        this.setState((state) => ({
            quote_name: 'Phoblacht Na hÉireann',
            quote_body : 'This is the day you will always remember as the day you almost caught captain jack sparrow.', 
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
            total_error_count : 0,
            count: 0,
            seconds : 0,
            input_disabled : false,

        }))
    }

    //Called when the end of the test is reached in compare()
    // Calculates word per minute
    endTest () {
        clearInterval(this.state.tInterval);
        console.log(this.state.error_count);
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

        return netWPM
    }

    render() {
        return (
            <div className="container">
                <br></br>
                <Container>
                    <Row>
                        <Col sm={8}>
                            <h4>{this.state.quote_name}</h4>
                            <Alert variant="secondary">
                                
                                <span className="quote-left">{this.state.quote_left}</span>
                                <span className="quote-error">{this.state.err_arr}</span>
                                <span className={this.state.quote_class}>{this.state.current_quote_char}</span>
                                <span className="quote-start">{this.state.quote_start.slice(1) }</span>
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
                            <input type="text"  onKeyDown={this.onInputChange} id='input' disabled={this.state.input_disabled}></input>
                            <button onClick={this.resetTest} style={{marginLeft: 10}} className="btn btn-secondary">
                                <svg className="bi bi-arrow-repeat" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clipRule="evenodd"/>
                                    <path fillRule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clipRule="evenodd"/>
                                </svg>
                            </button>
                        </Col>
                        <Col sm={4}>
                            <button onClick={this.debugToggle} className="btn btn-outline-warning" style={{float : "right"}}>Debug</button>
                        </Col>
                    </Row>
                    <br></br>
                    <Row >   
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
                                                Quote error : {this.state.quote_error}<br></br>
                                            </p>
                                    </Alert>
                                </div>
                               
                            </Collapse>      
                        </Col>
                    </Row>
                </Container>

                {/*<Sound
                url={keySound}
                playStatus={this.state.soundStatus}
                playFromPosition={0 /* in milliseconds 
                onLoading={this.handleSongLoading}
                onPlaying={this.handleSongPlaying}
                onFinishedPlaying={this.handleSongFinishedPlaying}
                 /> 
                 
                */}

                
                
            </div>
        )
    }
}