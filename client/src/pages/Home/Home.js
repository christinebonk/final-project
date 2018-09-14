import React, { Component } from "react";
import API from "../../utils/App.js";
import { Col, Row, Container } from "../../components/Grid";
import { Thead, Table, Tbody } from "../../components/Table";


class Home extends Component {

  componentDidMount() {
    this.loadBooks();
  }
 
  loadBooks = () => {
    API.searchUser()
      .then(res => console.log(res)
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
