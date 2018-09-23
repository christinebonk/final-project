import React, { Component } from "react";
import TopBar from "../../components/TopBar";
import API from "../../utils/App.js";
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";
import $ from "jquery";


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
            let account = res.data;
            account = account.map((entry, index) => {
                let obj = {
                  id: entry.id,
                  account: entry.account,
                  balance: entry.balance,
                  type: entry.type,
                  index: index            
                }
                return obj
            });
            this.setState({accounts: account});
            let total = 0;
            account.forEach(account => { total += account.balance });
            this.setState({total: total});
        });
    }

      editAssets = () => {
        $(".asset-input").removeAttr("readonly");
        $("#edit-assets-button").toggleClass("hide");
        $("#save-assets-button").toggleClass("hide");
      }

      saveAssets = () => {
        console.log("hello");
        let data = this.state.accounts;
        data.forEach(entry => {
          API.submitAccount(entry)
        });
        $("#edit-assets-button").toggleClass("hide");
        $("#save-assets-button").toggleClass("hide");
        $(".asset-input").prop("readonly", true);
      }

      updateAssetInput = (event, index) => {
        let { name, value } = event.target;
        let data = this.state.accounts;
        let selection = data[index];
        if (name === "balance") {
          value = parseInt(value);
        }
        selection[name] = value;
        data[index] = selection;
        this.setState({accounts:data});
      }

    render () { 
        return ( 
    	<div>
            <div className="asset-title">
                <h2>Assets</h2>
                <i id="edit-assets-button" onClick={this.editAssets} className="material-icons">edit</i>
                <i id="save-assets-button" onClick={this.saveAssets} className="hide material-icons">save</i>
              </div>
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
                    <td>
                        <input onChange={ (e) => this.updateAssetInput(e, account.index) }
                        className="asset-input" 
                        type="text" 
                        value={account.account} 
                        name="account"
                        id={account.id} 
                        readOnly/>
                    </td>
                    <td>
                        <input onChange={ (e) => this.updateAssetInput(e, account.index) }
                        className="asset-input" 
                        type="text" 
                        value={account.balance} 
                        name="balance"
                        id={account.id} 
                        readOnly/>
                    </td>
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
