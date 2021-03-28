import React, { Component } from 'react'
import styled from 'styled-components'
import ProductCounter from './ProductCounter/ProductCounter'

class Product extends Component {
  render () {
    const { product, orders, handleAddProductEvent, user } = this.props

    let productCounter = null
    let orderItem = null

    // exclude situations where orders have not loaded yet or no order have been set up
    if (orders) {
      const cart = orders.find(order => order.status === 'cart')
      orderItem = cart.orderItems.find(orderItem => orderItem.productId === product._id.toString())
    }
    // if user is logged in and product is in cart, display product counter
    if (user && orderItem) {
      productCounter = (
        <ProductCounter orderQuantity={orderItem.quantity} />
      )
    }

    return (
      <ProductComponent>
        <ProductImageContainer>
          <ProductImage src={product.imgUrl} alt={product.name} />
          {productCounter}
        </ProductImageContainer>
        <ProductTextContainer>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
        </ProductTextContainer>
        <ButtonContainer>
          <Button
            type='button'
            onClick={() => handleAddProductEvent(product)}
          >
            ${product.price.toFixed(2)}
          </Button>
        </ButtonContainer>
      </ProductComponent>
    )
  }
}

const ProductComponent = styled.div`
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 25px;
  display: grid;
  grid-template-columns: auto 50% 80px;
`

const ProductImageContainer = styled.div`
  // set position to relative to make this the initial containing block for the product counter div 
  position: relative;
  align-self: center;
  height: 50px;
  width: 50px;
  @media (min-width: 520px) {
    height: 100px;
    width: 100px;
  }
`

const ProductTextContainer = styled.div`
  margin-left: 10px;
`

const ButtonContainer = styled.div`
  align-self: self-end;
`

const ProductImage = styled.img`
  padding: 10px;
  border-radius: 20px;
  background-color: rgb(240,231,234);
  height: 50px;
  width: 50px;
  @media (min-width: 520px) {
    height: 100px;
    width: 100px;
  }
`

const ProductName = styled.h5`
  @media (min-width: 520px) {
    font-size: 1.6rem;
  }
`

const ProductDescription = styled.p`
  margin: 0;
`

const Button = styled.button`
  background-color: rgb(83,204,187);
  border: 2px solid rgb(0,116,102);
  padding: 3px;
  border-radius: 10px;
  width: 100%;
  color: rgb(0,117,103);
  text-align: center;
  transition: background-color 0.2s ease-in, color 0.2s ease-in;
  
  &:hover {
    background-color: rgb(0,154,132);
    color: rgb(255,255,255)
  }
`

export default Product
