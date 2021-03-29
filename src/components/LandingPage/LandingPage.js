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
    const { orders, handleAddProductEvent, user, handleDeleteOrderItem } = this.props
    if (!this.props.products) {
      return <p>Loading...</p>
    } else {
      const productsJSX = (
        this.props.products.map(product => (
          <Product
            key={product._id}
            product={product}
            handleAddProductEvent={handleAddProductEvent}
            orders={orders}
            user={user}
            handleDeleteOrderItem={handleDeleteOrderItem}
          />
        ))
      )

      return (
        <Div className="row">
          <div className="col-sm-12 col-md-10 mx-auto mt-5">
            <H3>Our Products</H3>
            <ProductsDiv className='mt-4'>
              { productsJSX }
            </ProductsDiv>
          </div>
        </Div>
      )
    }
  }
}

const Div = styled.div`
  margin-bottom: 60px;
`

const H3 = styled.h3`
  margin: 40px 0 20px;
`

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
