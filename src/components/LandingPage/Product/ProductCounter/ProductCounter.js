import React, { Component } from 'react'
import styled from 'styled-components'

class ProductCounter extends Component {
  render () {
    const { orderQuantity } = this.props

    return (
      <CounterDiv>{orderQuantity}</CounterDiv>
    )
  }
}

const CounterDiv = styled.div`
  position: absolute;
  top: 8px;
  right: -15px;
  color: white;
  background-color: rgb(0, 116, 102);
  border: 4px white solid;
  border-radius: 50px;
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default ProductCounter
