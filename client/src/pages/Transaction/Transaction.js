import React, { Component } from "react";
import API from "../../utils/App.js";
import TopBar from "../../components/TopBar";
import PieChart from "react-svg-piechart"
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";


class Transaction extends Component {
 

render () {
    return ( 
    <div>
        <TopBar title="Add Transaction"/>
        <Container>
            <Row>
                <Col size="s12">
                  
                </Col>
            </Row>
        </Container>
    </div>
)};

}



export default Transaction;
