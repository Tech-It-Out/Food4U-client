import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getProductsFromApi } from '../../api/products'

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      products: []
    }
  }

  componentDidMount () {
    // make axios call to set the products state
    getProductsFromApi()
      .then(response => {
        this.setState({
          products: response.data.products
        })
      })
      .catch(console.error)
  }

  render () {
    return (
      <Container fluid>
        <Row>
          <Col>
            <p>Test</p>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default LandingPage
