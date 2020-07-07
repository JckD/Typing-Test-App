import React, { Component } from 'react';
import Image from 'react-bootstrap/Image';
import BoldAndBrash from '../assets/B&B.png'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class TypingTest extends Component {

    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount(){

    }

    render() {
        return (
            <div className="container">
                <br></br>
                    <Row>
                        <Col sm={8}>
                            <h4>Create Quote -- Coming Soon</h4>
                        </Col>
                    </Row>


                {/**<Image src={BoldAndBrash} fluid /> */}
            </div>
        )
    }
}