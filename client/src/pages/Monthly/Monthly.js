import React, { Component } from "react";
import API from "../../utils/App.js";
import TopBar from "../../components/TopBar";
import PieChart from "react-svg-piechart"
import { Col, Row, Container } from "../../components/Grid";
import { EmptyBar, FullBar } from "../../components/Bars";
import $ from "jquery";



class Monthly extends Component {
    
    state = {
        budget: []
    }

    componentDidMount() {
        this.retrieveBudget();
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
        <TopBar title="Monthly View"/>
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
        </Container>
    </div>
)};
	
}



export default Monthly;
