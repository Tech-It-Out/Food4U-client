import React, { Component } from 'react'
import Product from './Product/Product'
import styled from 'styled-components'

class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      products: null
    }
  }

  render () {
    if (!this.props.products) {
      return <p>Loading...</p>
    } else {
      const productsJSX = (
        this.props.products.map(product => (
          <Product
            key={product._id}
            product={product}
            handleAddProductEvent={this.props.handleAddProductEvent}
          />
        ))
      )

      return (
        <ProductsDiv className='mt-4'>
          { productsJSX }
        </ProductsDiv>
      )
    }
  }
}

const ProductsDiv = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 25px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

export default LandingPage
