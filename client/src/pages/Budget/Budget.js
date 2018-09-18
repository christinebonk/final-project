import React, { Component } from "react";
import API from "../../utils/App.js";
import TopBar from "../../components/TopBar";
import PieChart from "react-svg-piechart"
import { Col, Row, Container } from "../../components/Grid";


class Budget extends Component {
  state = {
    data: [],
    budgetData: []
  };

  componentDidMount() {
    this.retrieveBudget();
  }

  retrieveBudget = () => {
    const color = ["#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD", "#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD", "#FABC09", "#25BEA0", "#FACC43", "#34073D", "#D3E3DD"];
    API.searchBudget()
    .then(res => {
      let budgetData = res.data.filter(entry => entry.type !== "income" && entry.period === "monthly");
      budgetData = budgetData.map((entry, index) => {
        let obj = {
          title: entry.name,
          value: entry.amount,
          type: entry.type,
          color: color[index]
        }
        return obj
        });
      this.setState({data:budgetData})
    })

  }

  createChart = () => {
    
    const data = [
      {title: "Data 1", value: 100, color: "#22594e"},
      {title: "Data 2", value: 60, color: "#2f7d6d"},
      {title: "Data 3", value: 30, color: "#3da18d"},
      {title: "Data 4", value: 20, color: "#69c2b0"},
      {title: "Data 5", value: 10, color: "#a1d9ce"} ]

    this.setState({data:data});
  }

  render() {
    return (
      <div>
        <TopBar title="Budget"/>
      
      <Row>
        <Col size="s6">
        <PieChart data={this.state.data}/>
        </Col>
        <Col size="s6">
        </Col>
      </Row>
      </div>
      );
  }

}



         
                  



export default Budget;
