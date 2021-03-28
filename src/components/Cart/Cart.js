import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import styled from 'styled-components'
import StripeButton from './Stripe/StripeButton'

class Cart extends Component {
  render () {
    const {
      handleDeleteOrderItem,
      orders,
      products,
      user,
      handleAddProductEvent
    } = this.props

    // locate and assign current cart
    const cart = orders.find(order => order.status === 'cart')

    const getProductUrl = productId => {
      // find product with productId and return the product imgUrl
      const product = products.find(product => product._id === productId)
      return product.imgUrl
    }

    const getProduct = productId => products.find(product => product._id === productId)

    const orderItemJSX = (
      cart.orderItems.map(orderItem => (
        <tr key={orderItem._id}>
          <td><ProductImg src={getProductUrl(orderItem.productId)} alt={orderItem.productName} /></td>
          <td>{orderItem.productName}</td>
          <td>${orderItem.price.toFixed(2)}</td>
          <td>{orderItem.quantity}</td>
          <td>${(orderItem.price * orderItem.quantity).toFixed(2)}</td>
          <td>
            <div onClick={() => handleAddProductEvent(getProduct(orderItem.productId), -1)}>-</div>
            <button
              type='button'
              onClick={() => handleDeleteOrderItem(cart._id, orderItem._id)}>
              X
            </button>
            <div onClick={() => handleAddProductEvent(getProduct(orderItem.productId), 1)}>+</div>
          </td>
        </tr>
      ))
    )

    const rowTotal = (
      <tr>
        <th colSpan='3'></th>
        <th>Total</th>
        <th>${cart.orderItems.reduce((acc, newVal) => {
          return acc + newVal.price * newVal.quantity
        }, 0).toFixed(2)}
        </th>
      </tr>
    )

    return (
      <Fragment>
        <h2>Your Cart</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan='2'>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Amend</th>
            </tr>
          </thead>
          <tbody>
            {orderItemJSX}
            {rowTotal}
          </tbody>
        </Table>
        <StripeButton
          type='button'
          user={user}
        />
      </Fragment>
    )
  }
}

const ProductImg = styled.img`
  width: 40px;
  height: 40px;
`

export default withRouter(Cart)
