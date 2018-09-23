import React, { Component } from "react";
import TopBar from "../../components/TopBar";
import API from "../../utils/App.js";
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";

class Networth extends Component {

    state = {
        accounts: [],
        total: 0
    }

    componentDidMount() {
        this.searchAccounts();   
    }
    
    searchAccounts = () => {
        API.searchAccount()
        .then(res => {
            const account = res.data;
            console.log(account);
            this.setState({accounts: account});
            let total = 0;
            account.forEach(account => { total += account.balance });
            this.setState({total: total});
        });
    }

    render () { 
        return ( 
    	<div>
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
                <tr>
                     <td>Total</td>
                    <td>{this.state.total}</td>
                    <td></td>
                </tr>
                  </Tbody></Table> )  : (
                <h3></h3>
                )
              }
        </div>
    	)};
}




export default Networth;
