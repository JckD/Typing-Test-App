import React, { Component } from 'react';
import Image from 'react-bootstrap/Image';
import BoldAndBrash from '../assets/B&B.png'


export default class TypingTest extends Component {

    render() {
        return (
            <div className="container">
                <p>Create Quote</p>

                <Image src={BoldAndBrash} fluid />
            </div>
        )
    }
}