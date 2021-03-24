import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getProductsFromApi } from '../../api/products'
import Product from './Product/Product'

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
          <Product
            key={product._id}
            name={product.name}
            description={product.description}
            price={product.price}
            imgUrl={product.imgUrl}
          />
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
