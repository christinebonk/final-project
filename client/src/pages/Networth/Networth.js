import React, { Component } from "react";
import TopBar from "../../components/TopBar";
import API from "../../utils/App.js";
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";

class Networth extends Component {

    state = {
        accounts: []
    }

    componentDidMount() {
        this.searchAccounts();   
    }
    
    searchAccounts = () => {
        API.searchAccount()
        .then(res => {
            console.log(res);
            this.setState({accounts: res.data});
        });
        
    }

    render () { 
        return ( 
    	<div>
            <TopBar title="Networth"/>
            <Container>
            	<Row>
            		<Col size="s12">
                        {this.state.accounts.length ? (
                            <Table>
                              <Thead>
                                <th>Account</th>
                                <th>Balance</th>
                                <th>Category</th>
                              </Thead>
                            <Tbody>
                            {this.state.accounts.map (account => (
                              <tr key={account.id}>
                                <td>{account.account}</td>
                                <td>{account.balance}</td>
                                <td>{account.type}</td>
                              </tr>
                              ))}
                              </Tbody></Table> )  : (
                            <h3>You are not on track for Financial Independence</h3>
                            )
                          }
            		</Col>
            	</Row>
            </Container>
        </div>
    	)};

}



export default Networth;
