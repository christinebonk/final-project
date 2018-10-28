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
    savingsRate: 0,
    incomeData: []
  };

  componentDidMount() {
    this.retrieveBudget();
  }

  //edit budget functions
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

  //edit income functions
  editIncome = () => {
    $(".income-input").removeAttr("readonly");
    $("#edit-income-button").toggleClass("hide");
    $("#save-income-button").toggleClass("hide");
    $(".income-table").toggleClass("hide");
  }

  saveIncome = () => {
    let data = this.state.incomeData;
    data.forEach(entry => {
      API.submitBudget(entry)
    });
    $("#edit-income-button").toggleClass("hide");
    $("#save-income-button").toggleClass("hide");
    $(".income-input").prop("readonly", true);
    $(".income-table").toggleClass("hide");
    this.retrieveBudget();
  }

  updateIncomeInput = (event, index) => {
    let { name, value } = event.target;
    let data = this.state.incomeData;
    let selection = data[index];
    if (name === "value") {
      if (!value) {
        value = 0;
      }
      value = parseInt(value, 10);
    }
    selection[name] = value;
    data[index] = selection;
    console.log(data);
    this.setState({incomeData:data});
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
    const colorExpense = ["#B60000", "#813C3C", "#CD6D00", "#FF9823", "#FFE423", "#FF23C0", "#C00CBD", "#ED66EB", "#F9A083"];
    const colorSavings = ["#66EDA7", "#006832", "#4A8667", "#00F304", "#0A900C", "#0A907A", "#6AC5B6", "#6AB6C5", "#207080", "#203780"];
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
          index: index,
          id: entry.id
        }
        if (obj.type === "expense") {
          obj["color"] = colorExpense[index];
        } else if (obj.type === "saving") {
          obj["color"] = colorSavings[index];
        }
        return obj
        });
      //determine income and expenses
      let incomeData = res.data.filter(entry => entry.type === "income");
      let income = 0;
      let expenses = 0;
      let savings = 0;
      budgetData.forEach(entry => {
        expenses += entry.value;
        if (entry.type === "saving") {
          savings += entry.value
        } else if (entry.type === "expense") {
        }
      });
      //income 
      incomeData.forEach((entry, index) => {
        income += entry.amount; 
        entry["index"] = index;
      });

      console.log(incomeData);
      let variation = income - expenses;
      let savingsRate = Math.round(savings/income*100);
      //set state
      this.setState({budgetData:budgetData, income:income, incomeData: incomeData, variation:variation, expenses: expenses, savingsRate: savingsRate});
    });
  }

  //show pie chart sections
  findCategory = (d) => {
    const income = this.state.income;
    if (d) {
      const title = d.title;
      let value = d.value
      value = "$" + value;
      let percentage = Math.round(d.value/income*100);
      percentage = percentage + "%";
      $("#display-data-category").text(title);
      $("#display-data-value").text(value);
      $("#display-data-percentage").text(percentage);
    }
    
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
          <div className="display-data">
            <div id="display-data-category"></div>
            <div id="display-data-value"></div>
            <div id="display-data-percentage"></div>
          </div>
          <Networth />
          </Col>
          <Col size="s8">
          <div className="budget-right">
          <div className="top-box">
          <div className="overview-title">
            <h2>Overview</h2>
            <i id="edit-income-button" onClick={this.editIncome} className="material-icons">edit</i>
            <i id="save-income-button" onClick={this.saveIncome} className="hide material-icons">save</i>
          </div>
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
          <div className="income-table hide">
            <h4>Edit Income</h4>
            <Table>
              <Thead>
                <th>Name</th>
                <th>Amount</th>
              </Thead>
              <Tbody>
              {this.state.incomeData.map (income => (
                <tr key={income.index}>
                  <td><input 
                      onChange={ (e) => this.updateIncomeInput(e, income.index) }
                      className="income-input" 
                      type="text" 
                      value={income.name} 
                      name="name"
                      index={income.index} 
                      readOnly/>
                  </td>
                  <td><input 
                      onChange={ (e) => this.updateIncomeInput(e, income.index) }
                      className="income-input" 
                      type="text" 
                      value={income.amount} 
                      name="amount"
                      index={income.index} 
                      readOnly/>
                  </td>
                </tr>
                ))}
              </Tbody>
            </Table>
          </div>
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
