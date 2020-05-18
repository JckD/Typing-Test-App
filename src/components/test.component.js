import React, { Component } from 'react';


export default class TypingTest extends Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.compare = this.compare.bind(this);


        this.state = {
            quote_name: 'Test Quote Title',
            quote_body : 'This is a "test" quote that I am hardcoding to make this site',
            user_input : '',
            quote_words: [],
            current_quote_word: '',
            count: 0
        }
    }

    componentDidMount () {
        let body = this.state.quote_body;
        

        let words = [];

        words = body.split(" ");

        this.setState({
            quote_words : words,
            current_quote_word : words[this.state.count]
        })
        
    }

    onInputChange (e) {
        const fieldName = e.target.name;

        this.setState({
            user_input : e.target.value
        
        })
        console.log(this.state.current_quote_word)
        this.compare(this.state.current_quote_word)
    }

 

    compare (current_word) {
        
        if (current_word === this.state.user_input) {
            console.log("match")
            this.setState({
                current_quote_word : this.state.quote_words[this.state.count],
                count: this.state.count + 1
            })
            console.log(this.state.count)
            
        }
    }

    render() {
        return (
            <div className="container">
                <h4>{this.state.quote_name}</h4>
                
                    
                <table style={{borborderWidth: 5,  borderColor: "black", borderStyle: "solid"}}>

                    <tbody>
                         <tr>
                            <p>{this.state.quote_body}</p>
                        </tr>
                    </tbody>
                   
                </table>
                 <br></br>   
                <input type="text" onChange={this.onInputChange}></input>
            </div>
        )
    }
}