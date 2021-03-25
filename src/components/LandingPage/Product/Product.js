import React, { Component } from 'react'
import styled from 'styled-components'

class Product extends Component {
  render () {
    return (
      <ProductComponent>
        <ProductImageContainer>
          <ProductImage src={this.props.imgUrl} alt={this.props.name} />
        </ProductImageContainer>
        <ProductTextContainer>
          <ProductName>{this.props.name}</ProductName>
          <ProductDescription>{this.props.description}</ProductDescription>
        </ProductTextContainer>
        <ButtonContainer>
          <Button type='button'>${this.props.price.toFixed(2)}</Button>
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
  align-self: center;
`

const ProductTextContainer = styled.div`
  margin-left: 10px;
`

const ButtonContainer = styled.div`
  align-self: self-end;
`

const ProductImage = styled.img`
  height: 50px;
  width: 50px;
  padding: 10px;
  border-radius: 20px;
  background-color: rgb(240,231,234);
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
  text-align: center;
`

export default Product
