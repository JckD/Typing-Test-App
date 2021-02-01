import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Card from "./Card";
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import styled from 'styled-components';
import { Link } from "react-router-dom";

const SearchInput = styled.input.attrs(props => ({
    type : 'text',
    placeholder : ' Search: Title, Author, User'
    
}))`
    background: white;
    border-radius: 5px;
    border: 1px solid darkgray;
    height : 35px;
    margin-left : 80px;
    width : 230px;
    float: right;
    :: disabled
`

// ranking component
const Ranking = props => (
    <tr>
        <td>{props.index + 1}</td>
        <td>{props.user.userName}</td>
        <td>{props.user.personalBestWPM}</td>
        <td>{props.user.personalBestAcc}%</td>
    </tr>
)

// leader ranking component
const Leader = props => (
    <tr>
        <td>{props.index + 1}</td>
        <td>{props.user.userName} <Badge variant="danger">Fastest Fingers</Badge></td>
        <td>{props.user.personalBestWPM}</td>
        <td>{props.user.personalBestAcc}%</td>
    </tr>
)

// leader ranking component
const BestAcc = props => (
    <tr>
        <td>{props.index + 1}</td>
        <td>{props.user.userName} <Badge variant="warning">Sharp Shooter</Badge></td>
        <td>{props.user.personalBestWPM}</td>
        <td>{props.user.personalBestAcc}%</td>
    </tr>
)

// leader ranking component
const LeaderAcc = props => (
    <tr>
        <td>{props.index + 1}</td>
        <td>
            {props.user.userName} {'  '}
            <Badge variant="danger">Fastest Fingers</Badge>{'  '}
            <Badge variant="warning">Sharp Shooter</Badge>
        </td>
        <td>{props.user.personalBestWPM}</td>
        <td>{props.user.personalBestAcc}%</td>
    </tr>
)

export default class QuoteList extends Component {

    constructor(props){
        super(props)

        this.search = this.search.bind(this);
        this.userList = this.userList.bind(this);

        this.state = {
            users: [],
            search : ''
        }
    }

    componentDidMount(){
        let APIURL = ''
        if (process.env.NODE_ENV === 'production') {
            APIURL = 'https://typingtest.jdoyle.ie'
        } else if (process.env.NODE_ENV === 'development') { 
            APIURL = 'http://localhost:8080'
        }
        axios.get(APIURL + '/user/')
            .then(response => {
                
                this.setState({ users : response.data});
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    userList(userList) {
        let accList = userList
        accList.sort((a, b) => ( a.personalBestAcc < b.personalBestAcc) ? 1 : -1)
        
        //console.log(accList)
        let bestAcc = accList[0]
        // sort user array by wpm, if they == sort by bigger Accuracy
        userList.sort((a, b) => ( a.personalBestWPM < b.personalBestWPM) ? 1 : (a.personalBestWPM === b.personalBestWPM) ?
        ((a.personalBestAcc < b.personalBestAcc) ? 1 : - 1) : -1)
        let bestWPM = userList[0]
        // get best accuracy
  
        // Return a differed row component for the leader
        return userList.map(function(currentUser, i){
            if (bestWPM === currentUser && bestAcc === currentUser) {
               return <LeaderAcc user={currentUser} key={i} index={i}/> 
            } else if (bestWPM === currentUser) {
                return <Leader user={currentUser} key={i} index={i}/>
            } else if (bestAcc == currentUser) {
                return <BestAcc user={currentUser} key={i} index={i}/>
            }
            return <Ranking user={currentUser} key={i} index={i} /> 
        })
    }

    search() {
        this.setState({
            search : document.getElementById('searchBar').value
        }) 
    }

    

    render() {
       
        return (
            <div className="container" style={{height : window.innerHeight}}>
                <Card>
                    <Row>
                        <Col sm={8}>
                            <h4>Leaderboard</h4>  
                        </Col>
                        
                        
                    </Row><br/>
                    <Row>
                        <Col>
                            <Table striped bordered hover responsive variant='dark'>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>User</th>
                                        <th>WPM</th>
                                        <th>Accuracy</th>

                                    </tr>
                                </thead>
                                <tbody>
                                   {this.userList(this.state.users)} 
                                </tbody>
                                
                            </Table>
                            
                        </Col>
                    </Row>

                </Card>
            </div>
        )
    }
}