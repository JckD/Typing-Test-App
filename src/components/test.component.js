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
import Card from './Card';
import Spinner from 'react-bootstrap/Spinner';




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
        this.sendHighscores = this.sendHighscores.bind(this);
        this.renderSpinner = this.renderSpinner.bind(this);
        this.increaseLike = this.increaseLike.bind(this);
        this.decreaseLike = this.decreaseLike.bind(this);
        this.updateQuoteScore = this.updateQuoteScore.bind(this);

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
            // boolean to display new personal best msg
            HSenabled : false,
            // boolean to display new quote best msg
            QHSenabled : false,
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
            resultsVariant : 'success',
            endMsg : 'Well done!',
            // Accuracy %
            accuracy : 0,
            // Highscores
            highestAcc : 0, 
            highestWPM : 0,
            quote_score : 0,
            quoteWPM : 0,
            quoteAcc : 0,
            quoteID : 0,

            upVote : false,
            downVote : false,
            //api url
            apiUrl : '',
            token : '',

            user : {},
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
                apiUrl : 'https://typingtest.jdoyle.ie',
            }))
            APIURL = 'https://typingtest.jdoyle.ie'
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
                    quote_score : response.data.quoteScore,
                    quoteWPM : response.data.highWPMScore,
                    quoteAcc : response.data.highAccScore,
                    quoteID : response.data._id
                }))
            })
            .catch(function (err) {
                console.log(err);
            })

        //if there is a use logged in get their account info
        if (localStorage.getItem('beepboop')) {
            let token = localStorage.getItem('beepboop')
            this.setState({
                token : token
            })

            axios.get( APIURL + '/user/profile', { headers : { 'auth-token' : token }})
            .then(res => {
               // console.log(res.data)
               this.setState({
                   user : res.data
               })
            })
        }
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
            //console.log("match");
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
        this.setState({
            quote_Title : '',
            quote_author : '',
            quote_body : '',
            char_array : []
        } )
        axios.get(this.state.apiUrl + '/quotes/random')
            .then(response => {
                this.setState((state) => ({ 
                    quote_Title : response.data.quoteTitle,
                    quote_body : response.data.quoteBody,
                    char_array : Array.from(response.data.quoteBody),
                    current_quote_char : Array.from(response.data.quoteBody)[0],
                    quote_start : response.data.quoteBody,
                    quote_author : response.data.quoteAuthor,
                    quoteWPM : response.data.highWPMScore,
                    quoteAcc : response.data.highAccScore,
                    quoteID : response.data._id
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
            HSenabled : false,
            QHSenabled : false,
            upVote : false,
            downVote : false,
            quote_score : 0
        }))
    }

    // Called when the end of the test is reached in compare()
    // Calculates word per minute
    endTest () {
        clearInterval(this.state.tInterval);
        let correctChars = this.state.char_array.length - this.state.total_error_count;

        let lastWPM = this.state.netWPM;
        let lastAccuracy = this.state.accuracy;
        
        let netWPM = Math.ceil(this.calculateWPM());

        let goodEndMsg = 'Well Done!';
        let avgEndMsg = 'Not Bad!';
        let badEndMsg = 'Yikes! You can do better';
        let endMsg = this.state.endMsg;

        // Conditional results statements
        let variant = this.state.resultsVariant;
        if ( netWPM > 41) {
            variant = 'success';
            endMsg = goodEndMsg;
        }
        else if (netWPM <= 41 && netWPM >= 25) {
            variant = 'warning';
            endMsg = avgEndMsg;

        } else if ( netWPM < 25 ) {
            variant = 'danger';
            endMsg = badEndMsg;
        }



        document.activeElement.blur();
        document.getElementById('input').focus();
        this.setState((state) => ({
            error_count : state.error_count,
            accuracy : Math.ceil((correctChars / state.char_array.length)*100),
            input_disabled : true,
            resultsVariant : variant,
            endMsg : endMsg,
            current_quote_char : '',
            quote_left : state.quote_body,
            seconds : 0,
            err_arr : '',
            netWPM : netWPM,
        }), () => this.calculateHighScore(lastAccuracy, lastWPM))
    }

    // Function that updates the user's high score is the latest score was better than the last replace the scores
    calculateHighScore (lastAccuracy, lastWPM) {
        let latestAccuracy = this.state.accuracy;
        let latestWPM = this.state.netWPM;
        let highestWPM = 0;
        let highestAcc = 0;

        //console.log(lastWPM, this.state.quoteWPM)
        

        if (latestWPM > lastWPM) {
            this.setState({
                highestAcc : latestAccuracy,
                highestWPM : latestWPM,
                
            })

            highestWPM = latestWPM;
            highestAcc = latestAccuracy
            if (this.state.token !== '') {

                // Check if score was better than user's personal best and update accordingly
                if(highestWPM > this.state.user.personalBestWPM ) {
                    console.log('you were better')
                    this.setState(state => ({
                        HSenabled : true,
                        user : {
                            ...this.state.user,
                            
                            personalBestAcc : highestAcc,
                            personalBestWPM : highestWPM,
                        }
                    }), () => this.sendHighscores(this.state.user))
                }

                // check if score was better than the best score for that quote and update accordingly
                if (latestWPM >= this.state.quoteWPM) {
                    //console.log('calling')
                    
                    this.setState({
                        QHSenabled : true,
                        quoteWPM : highestWPM,
                        quoteAcc : highestAcc
                    }, () => this.sendQuoteScores())
                }
                
            }

        }

        if (this.state.token !== '') {
            
            // Update user's latest scores array
            const update = {
                _id : this.state.user._id,
                wpm : latestWPM,
                acc : latestAccuracy
            } 
            console.log(update)
            axios.post(this.state.apiUrl + '/user/updateScores', update , { headers : {'auth-token' : this.state.token}})
            .then(res => {
                console.log(res.data.latestWPMScores)
            })
            .catch(err => err)
        }
    
    }

    sendHighscores(user) {
        console.log(user)
        axios.post(this.state.apiUrl + '/user/updateHS', user , { headers : {'auth-token' : this.state.token}})
        .then(res =>
            console.log(res.data)    
        ) .catch(err => err)
    }

    sendQuoteScores() {
        const scores = {
            quoteWPM : this.state.quoteWPM,
            quoteAcc : this.state.quoteAcc,
            _id : this.state.quoteID
        }

        axios.post(this.state.apiUrl + '/quotes/updateHS', scores, {headers : {'auth-token' : this.state.token}})
       .catch(err => err)
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
            //console.log(props.popper.state.elements.reference)

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
                    <Tooltip >
                        Show debug Info
                    </Tooltip>
                )
            } else if (props.popper.state.elements.reference.id === 'dislikeOverlay') {
                return (
                    <Tooltip id="button-tooltip" {...props}>
                        Like Quote
                    </Tooltip>
                )
            } else if (props.popper.state.elements.reference.id === 'likeOverlay') {
                return (
                    <Tooltip id="buton-tooltip" {...props}>
                        Dislike Quote
                    </Tooltip>
                )
            }
        }
        return  (
            <Tooltip {...props}>
                test
            </Tooltip>
        )     
    }

    renderSpinner() {
        if (!this.state.quote_Title) {
            return <Spinner animation="border" />
        } else {
            return <></>
        }
    }

    increaseLike() {
        
        if (!this.state.upVote && !this.state.downVote) {
            //if only upvote has been clicked not downvote
            // increase the score
            let likeDecrease = this.state.quote_score + 1;
            this.setState({
                quote_score : likeDecrease,
                upVote : true,
                downVote : false
            }, () => this.updateQuoteScore())
        } else if (!this.state.upVote && this.state.downVote) {
            // if down vote has already been clicked increase the score by 2
            // to account for undoing the down vote

            let likeDecrease = this.state.quote_score + 2;
            this.setState({
                quote_score : likeDecrease,
                upVote : true,
                downVote : false

            }, () => this.updateQuoteScore())
        } else if (this.state.upVote) {
            // unlike
            let likes = this.state.quote_score -1;
            this.setState({
                quote_score : likes,
                upVote : false,
            }, () => this.updateQuoteScore())
        }
    }

    decreaseLike() {
        if (!this.state.downVote && !this.state.upVote) {
            // if only downvote has been clicked not upvote
            // decrese the score
           let likeDecrease = this.state.quote_score - 1;

            this.setState({
                quote_score : likeDecrease,
                downVote : true,
                upVote : false,
            }, () => this.updateQuoteScore()) 

        } else if (!this.state.downVote && this.state.upVote) {
            // upvote has already been clicked decrease by 2
            // to account for undoing the upvote
            let likeDecrease = this.state.quote_score - 2;

            this.setState({
                quote_score : likeDecrease,
                downVote : true,
                upVote : false,
            }, () => this.updateQuoteScore()) 

        } else if (this.state.downVote) {
            // undo a down vote
            let likes = this.state.quote_score + 1;
            this.setState({
                quote_score : likes,
                downVote: false
            }, () => this.updateQuoteScore())
        }
    }

    updateQuoteScore() {
        
        const score = {
            _id : this.state.quoteID,
            quote_score : this.state.quote_score,
        }
        axios.post(this.state.apiUrl + '/quotes/updateRating', score)
        .catch(err => err)
    }

    render() {
        return (
            <div className="container" style={{height : window.innerHeight}}>
                <Card>
                        <Row>
                            <Col sm={8}>
                                <h4>{this.state.quote_Title} - {this.state.quote_author}</h4>
                                <Alert variant="secondary">   
                                    <span>{this.renderSpinner()}</span>
                                    <span className="quote-left">{this.state.quote_left}</span>
                                    <span className="quote-error">{this.state.err_arr}</span>
                                    <span className={this.state.quote_class}>{this.state.current_quote_char}</span>
                                    <span className="quote-start">{this.state.quote_start.slice(1)}</span>
                                    <span className="quote-right">{this.state.quote_right}</span>
                                    <hr/>
                                    <span>Best Score: {this.state.quoteWPM}WPM {this.state.quoteAcc}% Accuracy</span>
                                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip}>
                                        <span style={{float : "right"}} onClick={this.decreaseLike} id="dislikeOverlay">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                            </svg>
                                        </span>

                                    </OverlayTrigger>
                                    <span style={{float : "right", marginLeft : 5, marginRight : 5}}> {this.state.quote_score} </span>
                                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip}>
                                        <span style={{float : "right"}} onClick={this.increaseLike} id="likeOverlay">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                                                <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                                            </svg>
                                        </span>
                                    </OverlayTrigger>
                                    
                                    
                                    
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
                                      
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bug" viewBox="0 0 16 16">
                                            <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6a3.989 3.989 0 0 0-1.334-2.982A3.983 3.983 0 0 0 8 2a3.983 3.983 0 0 0-2.667 1.018A3.989 3.989 0 0 0 4 6h8z"/>
                                        </svg>
                                       
                                        
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                        </Row><br></br>
                        
                        <Row> 
                            <Col sm={8}>
                                <Collapse in={this.state.HSenabled}>
                                    <div>
                                        <Alert variant='success'>
                                            New Personal Best WPM Score! 
                                        </Alert>
                                    </div>  
                                </Collapse>
                                <Collapse in={this.state.QHSenabled}>
                                    <div>
                                       <Alert variant='success'>
                                            New Quite High Score!
                                        </Alert> 
                                    </div>
                                </Collapse>
                                <Collapse in={this.state.input_disabled}>
                                    <div id="results">
                                        <Alert variant={this.state.resultsVariant}>
                                            <Alert.Heading>{this.state.endMsg}</Alert.Heading>
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
               
            </div>  
        )
    }
}