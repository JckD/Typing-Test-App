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
        if (this.state.quote_body === this.state.user_input) {
            
        }
    }

    render() {
        return (
            <div className="container">
                <h4>{this.state.quote_name}</h4>
                
                    
                <table style={{borborderWidth: 5,  borderColor: "black", borderStyle: "solid"}}>
                    <tr>
                        <p>{this.state.quote_body}</p>
                    </tr>
                </table>
                 <br></br>   
                <input type="text" onChange={this.onInputChange}></input>
            </div>
        )
    }
}