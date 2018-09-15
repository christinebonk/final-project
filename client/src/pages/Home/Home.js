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
    increase: 0,
    fire_amount: 0
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
      this.setState({fire_amount: fireTotal})
    })
    .catch(err => console.log(err))
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
        })
      }
      )
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container>
        <Row>
          <Col size="s12">
            <Table>
              <Thead>
                <th>Year</th>
                <th>Goal</th>
                <th>Actual</th>
                <th>Difference</th>
                <th>Contribution</th>
              </Thead>
              <Tbody>
                <tr>
                    <td>2018</td>
                    <td>$12000</td>
                    <td>$11000</td>
                    <td>$1000</td>
                    <td>$1500</td>
                </tr>
                <tr>
                    <td>2019</td>
                      <td>$15000</td>
                      <td>$11000</td>
                      <td>$1000</td>
                      <td>$1500</td>
                </tr>
                <tr>
                    <td>2020</td>
                      <td>$20000</td>
                      <td>$11000</td>
                      <td>$1000</td>
                      <td>$1500</td>
                </tr>
              </Tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      );
  }

}



         
                  



export default Home;
