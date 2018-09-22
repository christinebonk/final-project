import React, { Component } from "react";
import API from "../../utils/App.js";
import TopBar from "../../components/TopBar";
import { Col, Row, Container } from "../../components/Grid";
import { EmptyBar, FullBar } from "../../components/Bars";
import $ from "jquery";
import { Thead, Table, Tbody } from "../../components/Table";




class Monthly extends Component {
state = {
    budget: [],
    transactions: []
}
    

    componentDidMount() {
        this.retrieveTransactions();
        this.retrieveBudget();
        
    }

    retrieveTransactions = () => {
        API.searchTransaction()
        .then(res => {
            console.log(res.data);
            this.setState({transactions: res.data});
        })
    }

    retrieveBudget = () => {
    API.searchBudget()
    .then(res => {
       //create budget object
      let budgetData = res.data.filter(entry => entry.type !== "income" && entry.period === "monthly");
      budgetData = budgetData.map((entry, index) => {
        let obj = {
          title: entry.name,
          value: entry.amount,
          type: entry.type,
          index: index
        }
        return obj
        });
      //set state
      this.setState({budget:budgetData}, this.calculateBars());
    })
  }

    calculateBars = () => {
        const goal = this.state.goal;
        const amount = this.state.fire_amount;
        let percentage = Math.round(amount/goal*100);
        let remainingPercentage = (100 - percentage);
        remainingPercentage = remainingPercentage + "%";
        percentage = percentage + "%";
        $(".bar-full").css("width", percentage);
        $(".bar-empty").css("width", remainingPercentage);
        this.setState({percentage: percentage, remainingPercentage: remainingPercentage});
    };

render () {
    return ( 
    <div>
        <TopBar onClick={this.showModal} title="Monthly View"/>
        <Container>
            <Row>
                <Col size="s12">
                    {this.state.budget.length ? (
                        <div className="budget-container">
                        {this.state.budget.map (budget => (
                            <div key={budget.index} className="section-container">
                                <div className="budget-section-left">
                                    <h4>{budget.title}</h4>
                                </div>
                                <div className="budget-section-right">
                                    <div className="bar-container" >
                                      <FullBar />
                                      <EmptyBar />
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <div>Hi</div>
                        )}
                </Col>
            </Row>
            <Row>
                <Col size="s12">
              {this.state.transactions.length ? (
                <Table>
                  <Thead>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Category</th>
                  </Thead>
                <Tbody>
                {this.state.transactions.map (transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.item}</td>
                    <td>{transaction.cost}</td>
                    <td>{transaction.category}</td>
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



export default Monthly;
