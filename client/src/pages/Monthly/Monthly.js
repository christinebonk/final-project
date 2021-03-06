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
        transactions: [],
        totalSpent: 0,
        total: 0,
        totalRemaining: 0,
        totalHappiness: 0,
        timePeriod: new Date(),
        savingsRate: 0
    }

    calculateSavingsRate = () => {
        let budget = this.state.budget;
        let transactions = this.state.transactions;
        let savings = 0;
        let total = this.state.total;
        budget = budget.filter((entry) => entry.type === "saving");
        budget.forEach(entry => {
            transactions.forEach(transaction => {
                if (transaction.category === entry.title) {
                    savings += transaction.cost
                }
            })
        });
        let savingsRate = Math.round(savings/total*100);
        this.setState({savingsRate: savingsRate});
    }

    editBudget = () => {
        $(".budget-input").removeAttr("readonly");
        $("#edit-button").toggleClass("hide");
        $("#save-button").toggleClass("hide");
        $(".delete-button").toggleClass("hide");
        $("#add-budget").toggleClass("hide");
    }

    saveTransaction = () => {
        let data = this.state.transactions;
        data.forEach(entry => {
          API.updateTransaction(entry)
          .then((res) => {
            this.retrieveTransactions();
          })
        });
        $("#edit-button").toggleClass("hide");
        $("#save-button").toggleClass("hide");
        $("#add-budget").toggleClass("hide");
        $(".delete-button").toggleClass("hide");
        $(".budget-input").prop("readonly", true);
        
    }

    updateInput = (event, index) => {
        let { name, value } = event.target;
        let data = this.state.transactions;
        let selection = data[index];
        if (name === "cost") {
          if (!value) {
            value = 0;
          }
          value = parseInt(value, 10);
        }
        selection[name] = value;
        data[index] = selection;
        this.setState({tranasctions:data});
      }

    deleteTransaction = (event, id) => {
        API.deleteTransaction(id)
        .then(() => {
          this.retrieveTransactions();
        }) 
    }

    componentDidMount() {
        this.retrieveTransactions();   
    }

    retrieveTransactions = () => {
        let date = this.state.timePeriod;
        date = new Date(date.getFullYear(), date.getMonth());
        date = JSON.stringify(date);
        API.searchTransaction(date)
        .then(res => {
            let transactions = res.data;
            transactions.forEach((entry, index) => {
                entry.index = index;
            });
            this.setState({transactions: res.data});
            this.retrieveBudget();
        })
    }

    retrieveBudget = () => {
        API.searchBudget()
        .then(res => {
    
    //create budget object
      let budgetData = res.data.filter(entry => entry.type !== "income" && entry.period === "monthly");
      let total = 0;
      let totalSpent = 0;  
        
      budgetData = budgetData.map((entry, index) => {
        total += entry.amount;
        let transactions = this.state.transactions;
        transactions = transactions.filter(item => item.category === entry.name);
        
        let spent = 0;
        transactions.forEach( (element) => {
            spent += element.cost;
            totalSpent += element.cost;
        })
        
        let obj = {
          title: entry.name,
          value: entry.amount,
          type: entry.type,
          index: index,
          spent: spent
        }
        return obj
        });

        let happyCount = this.state.transactions;
        happyCount = happyCount.filter(item => item.happy === true);
        let happinessAmount = 0;  
        happyCount.forEach(element => {
            happinessAmount += element.cost
        });
        let totalRemaining = total - totalSpent;
        if(totalRemaining < 0) {
            $("#total-remaining-value").addClass("overbudget");
        }
        let totalHappy = happinessAmount / totalSpent * 100;
        totalHappy = Math.round(totalHappy);
      //set state
      this.setState({budget:budgetData, total:total, totalSpent: totalSpent, totalRemaining: totalRemaining, totalHappy: totalHappy}, () => {
            this.calculateBars();
            this.calculateSavingsRate();
        });
    })
  }

    calculateBars = () => {
        const budget = this.state.budget;

        budget.forEach((element) => {
            const value = element.value;
            const spent = element.spent;
            let percentage = Math.round(spent/value*100);
            let remainingPercentage = (100 - percentage);
            remainingPercentage = remainingPercentage + "%";
            percentage = percentage + "%";
            $(`#${element.title} .bar-full`).css("width", percentage);
            $(`#${element.title} .bar-empty`).css("width", remainingPercentage);
        })        
    };

 

    displayNumber = (num) => {
        let display = Math.round(num);
        display = JSON.stringify(display);
        display = display.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        display = "$" + display; 
        return display;
      };

    updatePeriod = () => {
        let date = $(".period").val();
        date = new Date(date);
        this.setState({timePeriod: date}, () => {
            this.retrieveTransactions();
        });
    }

render () {
    const totalSpent = this.displayNumber(this.state.totalSpent);
    const totalRemaining = this.displayNumber(this.state.totalRemaining);
    const savingsRate = this.state.savingsRate + "%";
    return ( 
    <div>
        <TopBar onClick={this.showModal} title="Monthly View"/>
        <Container>
            <Row>
                <select id="show" onChange={this.updatePeriod} className="period">
                    <option value="Oct 2018">October 2018</option>
                    <option value="Sept 2018">September 2018</option> 
                </select>
            </Row>
            <Row>
              <Col size="s3">
                <div className="data-block">
                  <h3>Total Spent</h3>
                  <p>{totalSpent}</p>    
                </div>
              </Col>
              <Col size="s3">
                <div className="data-block">
                  <h3>Total Remaining</h3>
                  <p id="total-remaining-value">{totalRemaining}</p>    
                </div>
              </Col>
              <Col size="s3">
                <div className="data-block">
                  <h3>Savings Rate</h3>
                  <p>{savingsRate}</p>    
                </div>
              </Col>
              <Col size="s3">
                <div className="data-block">
                  <h3>Satisfaction</h3>
                  <p>{this.state.totalHappy}%</p>    
                </div>
              </Col>
            </Row>
            <Row>
                <Col size="s12 m6">
                <h2>Budget</h2>
                    {this.state.budget.length ? (
                        <div className="budget-container">
                        {this.state.budget.map (budget => (
                            <div id={budget.title} key={budget.index} className="section-container">
                                <div className="budget-section-left">
                                    <h4>{budget.title}</h4>
                                </div>
                                <div className="budget-section-right">
                                    <div className="stats-container">
                                        <div className="stats stats-spent">
                                            <span>Spent: ${budget.spent}</span>
                                        </div>
                                        <div className="stats stats-remaining">
                                            <span>Budgeted: ${budget.value}</span>
                                        </div>
                                    </div>
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
                <Col size="s12 m6">
                <div className="budget-title">
                <h2>Transactions</h2>
                    <i id="edit-button" onClick={this.editBudget} className="material-icons">edit</i>
                    <i id="save-button" onClick={this.saveTransaction} className="hide material-icons">save</i>
                </div>
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
                        <td><input 
                          onChange={ (e) => this.updateInput(e, transaction.index) }
                          className="budget-input" 
                          type="text" 
                          value={transaction.item} 
                          name="item"
                          index={transaction.index} 
                          readOnly/>
                        </td>
                        <td><input 
                          onChange={ (e) => this.updateInput(e, transaction.index) }
                          className="budget-input" 
                          type="text" 
                          value={transaction.cost} 
                          name="cost"
                          index={transaction.index} 
                          readOnly/>
                        </td>
                        <td>{transaction.category}</td>
                        <td><i 
                      onClick={ (e) => this.deleteTransaction(e, transaction.id) }
                      className="hide delete-button material-icons">delete</i></td>
                    </tr>
                  ))}
                  </Tbody></Table> )  : (
                <h3>No data to load</h3>
                )
              }
            
          </Col>
            </Row>
                
        </Container>
    </div>
)};
	
}



export default Monthly;
