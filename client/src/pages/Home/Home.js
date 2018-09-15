import React, { Component } from "react";
import API from "../../utils/App.js";
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";


class Home extends Component {
  state = {
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
    percentage: 0
  };

  componentDidMount() {
    this.getUser();
    this.getAmount();
  }

  calculateBars = () => {
    const goal = this.state.goal;
    const amount = this.state.fire_amount;
    let percentage = Math.round(amount/goal*100);

    this.setState({percentage: percentage})
  }

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
  }
 
  getUser = () => {
    API.searchUser()
      .then(res => {
        const data = res.data[0];
        console.log(data)
        const contribution = data.retirement_contribution;
        const cost = data.retirement_cost;
        const date = data.retirement_date;
        const withdrawal = data.retirement_withdrawal;
        const growth = data.yearly_growth;
        const increase = data.income_increase;
        let totalAmount = cost/withdrawal;
        console.log(totalAmount);
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

  displayNumber = (num) => {
    let display = Math.round(num);
    display = JSON.stringify(display);
    display = display.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    display = "$" + display; 
    return display;
  }

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
    let fireDisplay = this.displayNumber(fireAmount)
    let contributionDisplay = this.displayNumber(firstContribution);
    let roiDisplay = this.displayNumber(firstRoi)

    var firstObj = {
      year: year,
      contribution: contributionDisplay,
      roi: roiDisplay,
      fireAmount: fireDisplay
    }
    arr.push(firstObj);
    let finalYear;

    while (fireAmount > 0 && fireAmount < goal) {
      year++
      contribution = contribution + increase; 
      roi = fireAmount * growth;
      fireAmount = fireAmount + contribution + roi;
      let fireDisplay = this.displayNumber(fireAmount);
      let contributionDisplay = this.displayNumber(contribution);
      let roiDisplay = this.displayNumber(roi)

      var newObj = {
        year: year,
        contribution: contributionDisplay,
        roi: roiDisplay,
        fireAmount: fireDisplay
      };
      arr.push(newObj);
      finalYear = year;
      //increment
      
    }
    this.setState({projection: arr});
    this.setState({final_year: finalYear})
  }



  render() {
    return (
      <Container>
        <Row>
          <Col size="s12">
            <div className="data-block">
               <h3 className="data-header">You will Reach Financial Freedom by:</h3>
                  <p className="data-value">{this.state.final_year}</p>
                  <div className="section-bottom">
                  <div className="bar-container">
                    <div className="bar-full">
                        <p>{this.state.percentage}%</p>
                    </div>
                    <div className="bar-empty">
                    </div>
                </div>
                <h5>${this.state.fire_amount} out of ${this.state.goal}</h5>
            </div>

            </div>
          </Col>
          <Col size="s12">
            <Table>
              <Thead>
                <th>Year</th>
                <th>Fire Amount</th>
                <th>Goal Contribution</th>
                <th>ROI</th>
              </Thead>
              {this.state.projection.length ? (
                <Tbody>
                {this.state.projection.map (projection => (
                  <tr key={projection.year}>
                    <td>{projection.year}</td>
                    <td>{projection.fireAmount}</td>
                    <td>{projection.contribution}</td>
                    <td>{projection.roi}</td>
                  </tr>
                  ))}
                  </Tbody> )  : (
                <Tbody>
                <tr><td>No Results to Display</td></tr> 
                <tr><td>No Results to Display</td></tr>
                <tr><td>No Results to Display</td></tr>
                <tr><td>No Results to Display</td></tr>
                </Tbody>
                )
              }
            </Table>
          </Col>
        </Row>
      </Container>
      );
  }

}



export default Home;
