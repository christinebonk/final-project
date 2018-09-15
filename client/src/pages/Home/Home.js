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
    goal: 1000000
  };

  componentDidMount() {
    this.getUser();
    this.getAmount();
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
        const withdrawal = data.retirement_withdrawl;
        const growth = data.yearly_growth;
        const increase = data.income_increase;
        this.setState({
          contribution: contribution,
          cost: cost,
          date: date,
          withdrawal: withdrawal,
          growth: growth,
          increase: increase
         });
        this.getProjection();
      })
      .catch(err => console.log(err));
  };

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
    while (fireAmount > 0 && fireAmount < goal) {
      var newObj = {
        year: year,
        contribution: contribution,
        roi: roi,
        fireAmount: fireAmount
      };
      console.log(newObj)
      arr.push(newObj);

      //increment
      year++
      contribution = contribution + increase; 
      roi = fireAmount * growth;
      fireAmount = fireAmount + contribution + roi;
    }
    this.setState({projection: arr});
  }

  render() {
    return (
      <Container>
        <Row>
          <Col size="s12">
            <Table>
              <Thead>
                <th>Year</th>
                <th>Contribution</th>
                <th>ROI</th>
                <th>Fire Amount</th>
              </Thead>
              {this.state.projection.length ? (
                <Tbody>
                {this.state.projection.map (projection => (
                  <tr key={projection.year}>
                    <td>{projection.year}</td>
                    <td>{projection.contribution}</td>
                    <td>{projection.roi}</td>
                    <td>{projection.fireAmount}</td>
                  </tr>
                  ))}
                  </Tbody> )  : (
                <h3>No Results to Display </h3>
                )}
                
              }
            </Table>
          </Col>
        </Row>
      </Container>
      );
  }

}



export default Home;
