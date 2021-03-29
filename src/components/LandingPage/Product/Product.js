import React, { Component } from 'react'
import styled from 'styled-components'
import ProductCounter from './ProductCounter/ProductCounter'

class Product extends Component {
  render () {
    const { product, orders, handleAddProductEvent, user, handleDeleteOrderItem } = this.props

    let productCounterJSX = null
    let deleteButtonJSX = null
    let orderItem = null
    let orderId = null
    let orderItemId = null

    // exclude situations where orders have not loaded yet or no order have been set up
    if (orders) {
      const cart = orders.find(order => order.status === 'cart')
      orderId = cart._id.toString()
      orderItem = cart.orderItems.find(orderItem => orderItem.productId === product._id.toString())
      if (orderItem) {
        orderItemId = orderItem._id.toString()
      }
    }
    // if user is logged in and product is in cart, display product counter
    if (user && orderItem) {
      productCounterJSX = (
        <ProductCounter orderQuantity={orderItem.quantity} />
      )
      deleteButtonJSX = (
        <DeleteButton onClick={() => handleDeleteOrderItem(orderId, orderItemId)}>x</DeleteButton>
      )
    }

    return (
      <ProductComponent>
        <ProductImageContainer>
          <ProductImage src={product.imgUrl} alt={product.name} />
          {productCounterJSX}
        </ProductImageContainer>
        <ProductTextContainer>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
        </ProductTextContainer>
        {deleteButtonJSX}
        <ButtonContainer>
          <Button
            type='button'
            onClick={() => handleAddProductEvent(product, 1)}
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
  // set position to relative to make this the initial containing block for the DeleteButton
  position: relative;
  min-height: 100px;
  
  &:hover {
    div img {
      transform: scale(1.01) rotate(2deg);
    }
  }
`

const ProductImageContainer = styled.div`
  // set position to relative to make this the initial containing block for the product counter div 
  position: relative;
  align-self: center;
  height: 50px;
  width: 50px;
  @media (min-width: 520px) {
    height: 70px;
    width: 70px;
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
  transition: transform .18s ease-out;
  @media (min-width: 520px) {
    height: 70px;
    width: 70px;
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

const DeleteButton = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  color: rgb(146,0,46);
  border: 2px solid rgb(146,0,46);
  border-radius: 10px;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  padding: 0;
  box-shadow: 1px 1px 7px #c4c4c4;
  transition: background-color 0.2s ease-in, color 0.2s ease-in;
  &:hover {
    background-color: rgb(0,154,132);
    color: rgb(255,255,255);
    cursor: pointer;
  }
`

export const Button = styled.button`
  background-color: rgb(83,204,187);
  border: 2px solid rgb(0,116,102);
  padding: 3px;
  border-radius: 10px;
  width: 100%;
  color: rgb(0,116,102);
  text-align: center;
  box-shadow: 1px 1px 7px #c4c4c4;
  transition: background-color 0.2s ease-in, color 0.2s ease-in;
  &:hover {
    background-color: rgb(0,154,132);
    color: rgb(255,255,255)
  }
`

export default Product
