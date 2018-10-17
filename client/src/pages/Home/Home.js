import React, { Component } from "react";
import API from "../../utils/App.js";
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";
import { EmptyBar, FullBar } from "../../components/Bars";
import { UpdateBox, UpdateButton } from "../../components/UpdateBox";
import $ from "jquery";
import BarChart from "react-svg-bar-chart"
import TopBar from "../../components/TopBar"

class Home extends Component {
  state = {
    data: [],
    projection: [],
    contribution: 0,
    cost: 0,
    date: 0,
    withdrawal: 0.04,
    growth: 0.06,
    increase: 100,
    fire_amount: 0,
    goal: 1000000,
    final_year: 0,
    percentage: 0,
    remainingPercentage: 100,
    addedContribution: 0
  };

  componentDidMount() {
    this.getUser();
    this.getAmount();
  };

  //reset assumptions
  reset = () => {
    this.getUser();
    this.getAmount();
    $(".assumption-icon").css("color", "#D3E3DD");
  }

  //create data for bar chart
  createChart = () => {
    const projection = this.state.projection;
    let data = projection.map (projection => {
      const obj = {
        x: projection.year,
        y: projection.fireAmount
      }
      return obj
    });
    this.setState({data:data}) 
  };
  
  //calculate the overall progress to goal chart
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

  //calculate goal
  calculateGoal = (cost,withdrawal) => {
    let goal = cost/withdrawal;
    this.setState({goal: goal});
    return goal;
  }

  //get amount saved so far
  getAmount = () => {
    API.searchAccount()
    .then(res => {
      const data = res.data;
      let fireAccounts = data.filter(entry => entry.include === true);
      let fireTotal = 0;
      fireAccounts.forEach(fire => {
        fireTotal += fire.balance;
      });
      this.setState({fire_amount: fireTotal}, () => {
        this.getProjection();
        this.calculateBars();        
      });
    })
    .catch(err => console.log(err));
  };

  //save assumptions to database
  updateAssumptions = () => {
    var contribution = this.state.contribution;
    var cost = this.state.cost;
    var withdrawal = this.state.withdrawal;
    var increase = this.state.increase;
    var growth = this.state.growth;
    var date = this.state.date;

    var userData = {
      date: date,
      amount: cost,
      contribution: contribution,
      withdrawal: withdrawal,
      increase: increase,
      growth: growth

    }
    API.submitUser(userData);
    $(".assumption-icon").css("color", "#D3E3DD");
  }

  //get user assumptions from database
  getUser = () => {
    API.searchUser()
      .then(res => {
        const data = res.data[0];
        const contribution = data.retirement_contribution;
        const cost = data.retirement_cost;
        const date = data.retirement_date;
        const withdrawal = data.retirement_withdrawal;
        const growth = data.yearly_growth;
        const increase = data.income_increase;
        let totalAmount = cost/withdrawal;
        this.setState({
          contribution: contribution,
          cost: cost,
          date: date,
          withdrawal: withdrawal,
          growth: growth,
          increase: increase,
          goal: totalAmount
         }, () => {

         });
        this.getProjection();
      })
      .catch(err => console.log(err));
  };

  //function to display $ amount
  displayNumber = (num) => {
    let display = Math.round(num);
    display = JSON.stringify(display);
    display = display.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    display = "$" + display; 
    return display;
  };

  //get the projection YoY
  getProjection = () => {
    let fireAmount = this.state.fire_amount;
    const increase = this.state.increase;
    const goal = this.state.goal;
    let growth = this.state.growth;
    let contribution = this.state.contribution;
    let arr = [];
    let date = new Date();
    let month = date.getMonth();
    let monthLeft = 12 - month; 
    let year = date.getFullYear();
    let roi = 0;
    let firstContribution = contribution/12*monthLeft;
    let firstRoi = fireAmount*growth/12*monthLeft;

    fireAmount = fireAmount + firstContribution + firstRoi;
    let contributionDisplay = this.displayNumber(firstContribution);
    let roiDisplay = this.displayNumber(firstRoi);
    let fireDisplay = this.displayNumber(fireAmount);

    var firstObj = {
      year: year,
      contribution: contributionDisplay,
      roi: roiDisplay,
      fireDisplay: fireDisplay,
      fireAmount: fireAmount
    }
    arr.push(firstObj);
    let finalYear;

    while (fireAmount > 0 && fireAmount < goal) {
      year++
      contribution = contribution + increase; 
      roi = fireAmount * growth;
      fireAmount = fireAmount + contribution + roi;
      let contributionDisplay = this.displayNumber(contribution);
      let fireDisplay = this.displayNumber(fireAmount);
      let roiDisplay = this.displayNumber(roi)
      var newObj = {
        year: year,
        contribution: contributionDisplay,
        roi: roiDisplay,
        fireDisplay: fireDisplay,
        fireAmount: fireAmount
      };
      arr.push(newObj);
      finalYear = year;
      //increment
    }
    this.setState({projection: arr} , () => {
      this.createChart();
    });
    this.setState({final_year: finalYear}, () => this.getNeededAmount)
  }

  projectDate = (contribution, goal, amount, growth, year) => {
    let roi = 0;
    while (amount > 0 && amount < goal) {
      year++
      roi = amount * growth;
      amount = amount + contribution + roi;
    }
    return year;
  } 

  getNeededAmount = () => {
    let fireAmount = this.state.fire_amount;
    const goal = this.state.goal;
    let growth = this.state.growth;
    let contribution = this.state.contribution;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let goalDate = this.state.date;
    let finalYear = this.state.final_year; 
    let newContribution = contribution;
    while (finalYear > goalDate) {
      newContribution = newContribution + 100;
      finalYear = this.projectDate(newContribution, goal, fireAmount, growth, currentYear);
    }
    const addedContribution = newContribution - contribution;
    this.setState({addedContribution: addedContribution})
  }

  getInterest = () => {
    const cost = this.state.cost;
    const amount = this.state.fire_amount;
    const growth = this.state.growth;

    const yearlyRoi = amount * growth;
    let covered = yearlyRoi/cost;
    covered = Math.round(covered * 100);
    covered = covered + "%";
    return covered;
  }

  handleClick = (operation, increment, category, value) => {

    $(".assumption-icon").css("color", "#FABC09");

    if (operation === "plus") {
      value = value + increment;
    } else if (operation === "minus") {
      value = value - increment;
    }

    if (category === "cost") {
      this.calculateGoal(value, this.state.withdrawal);
    } else if (category === "withdrawal") {
      this.calculateGoal(this.state.cost, value);
    }

    let newObj = {} 
    newObj[category] = value;

    this.setState(newObj, () => {
      this.getProjection();
      this.calculateBars();
      this.getNeededAmount();
    })
  } 


  render() {
    const timeDifference = this.state.final_year - this.state.date;
    const fireAmount = this.displayNumber(this.state.fire_amount);
    const goal = this.displayNumber(this.state.goal);
    const cost = this.displayNumber(this.state.cost);
    const addedContribution = this.displayNumber(this.state.addedContribution);
    const covered = this.getInterest();
    const contribution = this.displayNumber(this.state.contribution);
    const contributionIncrease = this.displayNumber(this.state.increase);
    let withdrawal = (this.state.withdrawal * 100).toFixed(2);
    withdrawal = withdrawal + "%";
    let growth = (this.state.growth * 100).toFixed(2);
    growth = growth + "%";

    return (
      <div>
        <TopBar title="Financial Indepdence Dashboard"/>
      <Container>
        <Row>
          <Col size="s12">
            <div className="data-block head-block">
               <h3 className="data-header">You will Reach Financial Freedom by<span className="data-value">{this.state.final_year}</span></h3>
                  <div className="section-bottom">
                    <div className="bar-container" >
                      <FullBar />
                      <EmptyBar />
                    </div>
                </div>
                <h5>{fireAmount} out of {goal}</h5>
            </div>
          </Col>
        </Row>
        <Row>
          <Col size="s4">
            <div className="data-block">
              <h3>Projected Years Away from Your Goal</h3>
              <p>{timeDifference}</p>    
            </div>
          </Col>
          <Col size="s4">
            <div className="data-block">
              <h3>Annual Increase to Reach Goal</h3>
              <p>{addedContribution}</p>    
            </div>
          </Col>
          <Col size="s4">
            <div className="data-block">
              <h3>Expenses covered by Interest</h3>
              <p>{covered}</p>    
            </div>
          </Col>
        </Row>
        <Row>
        <div className="variable">
            <Col size="s12">
              <div className="variable-container">
                <h2 className="assumptions">Your Assumptions</h2>
                  <i id="reset-button" onClick={this.reset} className="assumption-icon material-icons">undo</i>
                  <i onClick={this.updateAssumptions} className="assumption-icon material-icons">save</i>
              </div>
            </Col>
            <Col size="s6 m4 l2">
              <UpdateBox title="Retirement Expenses" amount={cost}>
                <UpdateButton onClick={() => this.handleClick("plus", 1000, "cost", this.state.cost )}>+</UpdateButton>
                <UpdateButton onClick={() => this.handleClick("minus", 1000, "cost", this.state.cost )}>-</UpdateButton>
              </UpdateBox>
            </Col>
            <Col size="s6 m4 l2">
              <UpdateBox title="Annual Withdrawal" amount={withdrawal}>
                <UpdateButton onClick={() => this.handleClick("plus", 0.0025, "withdrawal", this.state.withdrawal )}>+</UpdateButton>
                <UpdateButton onClick={() => this.handleClick("minus", 0.0025, "withdrawal", this.state.withdrawal )}>-</UpdateButton>
              </UpdateBox>
            </Col>
            <Col size="s6 m4 l2">
              <UpdateBox title="Annual Contribution" amount={contribution}>
                <UpdateButton onClick={() => this.handleClick("plus", 1000, "contribution", this.state.contribution )}>+</UpdateButton>
                <UpdateButton onClick={() => this.handleClick("minus", 1000, "contribution", this.state.contribution )}>-</UpdateButton>
              </UpdateBox>
            </Col>
            <Col size="s6 m4 l2">
              <UpdateBox title="Contribution Increase" amount={contributionIncrease}>
                <UpdateButton onClick={() => this.handleClick("plus", 500, "increase", this.state.increase )}>+</UpdateButton>
                <UpdateButton onClick={() => this.handleClick("minus", 500, "increase", this.state.increase )}>-</UpdateButton>
              </UpdateBox>
            </Col>
            <Col size="s6 m4 l2">
              <UpdateBox title="Annual Growth Rate" amount={growth}>
                <UpdateButton onClick={() => this.handleClick("plus", 0.005, "growth", this.state.growth )}>+</UpdateButton>
                <UpdateButton onClick={() => this.handleClick("minus", 0.005, "growth", this.state.growth )}>-</UpdateButton>
              </UpdateBox>
            </Col>
            <Col size="s6 m4 l2">
              <UpdateBox title="Target FIRE Year" amount={this.state.date}>
                <UpdateButton onClick={() => this.handleClick("plus", 1, "date", this.state.date )}>+</UpdateButton>
                <UpdateButton onClick={() => this.handleClick("minus", 1, "date", this.state.date )}>-</UpdateButton>
              </UpdateBox>
            </Col>
            </div>
        </Row> 
        <Row>
        <Col size="s12">
          <h2 className="assumptions">Projections</h2>
          <div className="graph-div">
            <BarChart labelsStepX={1} data={this.state.data} onHover={this.handlePointHover} />
          </div>
        </Col>
        </Row>
        <Row>
          <Col size="s12">
              {this.state.projection.length ? (
                <Table>
                  <Thead>
                    <th>Year</th>
                    <th>Fire Amount</th>
                    <th>Goal Contribution</th>
                    <th>ROI</th>
                  </Thead>
                <Tbody>
                {this.state.projection.map (projection => (
                  <tr key={projection.year}>
                    <td>{projection.year}</td>
                    <td>{projection.fireDisplay}</td>
                    <td>{projection.contribution}</td>
                    <td>{projection.roi}</td>
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
      );
    }
  }



export default Home;
