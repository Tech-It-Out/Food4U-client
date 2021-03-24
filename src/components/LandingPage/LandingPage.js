import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getProductsFromApi } from '../../api/products'
// import Product from './Product/Product'

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      products: null
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
    if (!this.state.products) {
      return <p>Loading...</p>
    } else {
      const productsJSX = (
        this.state.products.map(product => (
          <div key={product._id}>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <p>{product.imgUrl}</p>
          </div>
        ))
      )

      return (
        <Container fluid>
          <Row>
            <Col>
              { productsJSX }
            </Col>
          </Row>
        </Container>
      )
    }
  }
}

export default LandingPage
