import React, { Component } from 'react';


export default class TypingTest extends Component {

    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.compare = this.compare.bind(this);

        this.state = {
            quote_name: 'Test Quote Title',
            quote_body : 'This is a test quote that I am hardcoding to make this site',
            user_input : '',
        }
    }

    onInputChange (e) {
        const fieldName = e.target.name;

        this.setState({
            user_input : e.target.value
        
        })
        this.compare()
    }

    compare () {

    }

    render() {
        return (
            <div className="container">
                <h4>{this.state.quote_name}</h4>
                <p>
                <span className="border border-dark">{this.state.quote_body}</span>
                </p>
                    
    
                <input type="text" onChange={this.onInputChange}></input>
            </div>
        )
    }
}