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

  deleteBudget = (event, id) => {
    API.deleteBudget(id)
    .then(() => {
      this.retrieveBudget();
    }) 
  }

  editBudget = () => {
    $(".budget-input").removeAttr("readonly");
    $("#edit-button").toggleClass("hide");
    $("#save-button").toggleClass("hide");
    $("#add-budget").toggleClass("hide");
    $(".delete-button").toggleClass("hide");
  }

  addBudget = () => {
    var title = $("input[name=add-title]").val().trim();
    var value = $("input[name=add-value]").val().trim();
    var type = $(".add-type").val();
    var data = {
      title: title,
      value: value,
      type: type
    }
    $("input[name=add-title]").val("");
    $("input[name=add-value]").val("");
    API.addBudget(data)
    .then(() => {
      $("#edit-button").toggleClass("hide");
      $("#save-button").toggleClass("hide");
      $("#add-budget").toggleClass("hide");
      $(".delete-button").toggleClass("hide");
      $(".budget-input").prop("readonly", true);
      this.retrieveBudget();
    }) 
  }

  saveBudget = () => {
    let data = this.state.budgetData;
    data.forEach(entry => {
      API.submitBudget(entry)
    });
    $("#edit-button").toggleClass("hide");
    $("#save-button").toggleClass("hide");
    $("#add-budget").toggleClass("hide");
    $(".delete-button").toggleClass("hide");
    $(".budget-input").prop("readonly", true);
    this.retrieveBudget();
  }

  updateInput = (event, index) => {
    let { name, value } = event.target;
    let data = this.state.budgetData;
    let selection = data[index];
    if (name === "value") {
      if (!value) {
        value = 0;
      }
      value = parseInt(value, 10);
    }
    selection[name] = value;
    data[index] = selection;
    this.setState({budgetData:data});
  }

  retrieveBudget = () => {
    //define colours for chart
    const color = ["#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD", "#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD", "#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD"];

    //retrieve budget
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
      // let spending = 0 -- this is not used currently
      budgetData.forEach(entry => {
        expenses += entry.value;
        if (entry.type === "saving") {
          savings += entry.value
        } else if (entry.type === "expense") {
          // spending += entry.value
        }
      });
      incomeData.forEach(entry => {
        income += entry.amount; 
      })
      let variation = income - expenses;
      let savingsRate = Math.round(savings/income*100);
      //set state
      this.setState({budgetData:budgetData, income:income, variation:variation, expenses: expenses, savingsRate: savingsRate});
    });
  }

  //pie chart function
  findCategory = (d) => {
    const data = this.state.budgetData;
    data.filter(obj => {
      return obj.title === d;
    });
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
                    <td><i 
                      onClick={ (e) => this.deleteBudget(e, budget.id) }
                      className="hide delete-button material-icons">delete</i></td>
                  </tr>
                  ))}
                  <tr className="hide" id="add-budget">
                    <td><input 
                      className="budget-add-input" 
                      type="text" 
                      name="add-title"
                      /></td>
                    <td><input 
                      type="text" 
                      className="budget-add-input" 
                      name="add-value" 
                      /></td>
                    <td>
                      <select id="show" className="add-type">
                        <option value="saving">Saving</option>
                        <option value="expense">Expense</option>
                      </select>
                    </td>
                    <td><i 
                      onClick={this.addBudget}
                      className=" add-button material-icons">add_circle</i></td>
                  </tr>
                  </Tbody></Table> )  : (
                <h3>No data to load</h3>
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
