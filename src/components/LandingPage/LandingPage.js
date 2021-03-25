import React, { Component } from 'react'
import { getProductsFromApi } from '../../api/products'
import Product from './Product/Product'
import styled from 'styled-components'

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
        // sort products array by product name in alphabetically ascending order
        return response.data.products.sort(function (a, b) {
          return a.name.localeCompare(b.name)
        })
      })
      .then(products => {
        this.setState({
          products: products
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
