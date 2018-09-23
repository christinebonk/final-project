import React, { Component } from "react";
import API from "../../utils/App.js";
import TopBar from "../../components/TopBar";
import PieChart from "react-svg-piechart"
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";
import $ from "jquery";
import Networth from "../Networth";



class Budget extends Component {
  state = {
    budgetData: [],
    income: 0,
    varation: 0, 
    expenses: 0,
    savingsRate: 0
  };

  componentDidMount() {
    this.retrieveBudget();
  }

  editBudget = () => {
    console.log("hi");
    $(".budget-input").removeAttr("readonly");
    $("#edit-button").toggleClass("hide");
    $("#save-button").toggleClass("hide");
  }

  saveBudget = () => {
    let data = this.state.budgetData;
    data.forEach(entry => {
      API.submitBudget(entry)
    });
    $("#edit-button").toggleClass("hide");
    $("#save-button").toggleClass("hide");
    $(".budget-input").prop("readonly", true);

    this.retrieveBudget();

  }

  updateInput = (event, index) => {
    let { name, value } = event.target;
    let data = this.state.budgetData;
    let selection = data[index];
    if (name === "value") {
      value = parseInt(value);
    }
    
    selection[name] = value;
    data[index] = selection;
    console.log(data);
    this.setState({budgetData:data});
  }

  retrieveBudget = () => {
    const color = ["#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD", "#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD", "#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD"];

    API.searchBudget()
    .then(res => {
       //create budet object
      let budgetData = res.data.filter(entry => entry.type !== "income" && entry.period === "monthly");
      budgetData = budgetData.map((entry, index) => {
        let obj = {
          title: entry.name,
          value: entry.amount,
          type: entry.type,
          color: color[index],
          index: index,
          id: entry.id
        }
        return obj
        });

      //determine income and expenses
      let incomeData = res.data.filter(entry => entry.type === "income");
      let income = 0;
      let expenses = 0;
      let savings = 0;
      let spending = 0;
      budgetData.forEach(entry => {
        expenses += entry.value;
        if (entry.type === "saving") {
          savings += entry.value
        } else if (entry.type === "expense") {
          spending += entry.value
        }
      });

      incomeData = incomeData.forEach(entry => {
        income += entry.amount; 
      })
      let variation = income - expenses;
      let savingsRate = Math.round(savings/income*100);
      console.log(budgetData);

      //set state
      this.setState({budgetData:budgetData, income:income, variation:variation, expenses: expenses, savingsRate: savingsRate});
    })

  }

  findCategory = (d) => {
    console.log(d);
    const data = this.state.budgetData;
    const result = data.filter(obj => {
      return obj.title === d;
    });
    console.log(result);
  }

  render() {
    return (
      <div>
        <TopBar title="Budget"/>
      <Container>
        <Row>
          <Col size="s4">
          <PieChart 
          expandOnHover expandSize={2} 
          data={this.state.budgetData}
          onSectorHover={(d, i, e) => { this.findCategory(d) }}
          />
          <h2>Assets</h2>
          <Networth />
          </Col>
          <Col size="s8">
          <div className="budget-right">
          <div className="top-box">
          <h2>Overview</h2>
          <Table>
            <Thead>
              <th>Income</th>
              <th>Variation</th>
              <th>Expenses</th>
              <th>Savings Rate</th>
            </Thead>
            <Tbody>
            <tr>
              <td>{this.state.income}</td>
              <td>{this.state.variation}</td>
              <td>{this.state.expenses}</td>
              <td>{this.state.savingsRate}%</td>
            </tr>
            </Tbody>
          </Table>
            
          </div>
          <div className="budget-title">
            <h2>Budget Categories</h2>
            <i id="edit-button" onClick={this.editBudget} className="material-icons">edit</i>
            <i id="save-button" onClick={this.saveBudget} className="hide material-icons">save</i>
          </div>
            {this.state.budgetData.length ? (
                <Table>
                  <Thead>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </Thead>
                <Tbody>
                {this.state.budgetData.map (budget => (
                  <tr key={budget.index}>
                    <td><input 
                      onChange={ (e) => this.updateInput(e, budget.index) }
                      className="budget-input" 
                      type="text" 
                      value={budget.title} 
                      name="title"
                      index={budget.index} 
                      readOnly/></td>
                    <td><input 
                      onChange={ (e) => this.updateInput(e, budget.index) }
                      type="text" 
                      className="budget-input" 
                      value={budget.value} 
                      name="value" 
                      index={budget.index} 
                      readOnly/></td>
                    <td>{budget.type}</td>
                  </tr>
                  ))}
                  </Tbody></Table> )  : (
                <h3></h3>
                )
              }
            </div>
          </Col>
        </Row>
      </Container>
      </div>
      );
  }

}

         
                  



export default Budget;
