import React, { Component } from "react";
import API from "../../utils/App.js";
import TopBar from "../../components/TopBar";
import PieChart from "react-svg-piechart"
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";



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
          index: index
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
          <h2>Budget Categories</h2>
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
                    <td>{budget.title}</td>
                    <td>{budget.value}</td>
                    <td>{budget.type}</td>
                  </tr>
                  ))}
                  </Tbody></Table> )  : (
                <h3>You are not on track for Financial Independence</h3>
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
