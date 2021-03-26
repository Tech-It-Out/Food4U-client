import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import styled from 'styled-components'
import {
  deleteOrderItem,
  getOrderHistoryFromAPI
} from '../../api/orders'

class Cart extends Component {
  handleDeleteOrderItem = (orderId, orderItemId) => {
    // 1) send delete orderItem request to API
    deleteOrderItem(orderId, orderItemId, this.props.user.token)
      .then(() => {
        console.log('Success')
        // 2) upon successfully resolving the promise, get updated order history
        return getOrderHistoryFromAPI(this.props.user.token)
      })
      // 3) update state in APP with latest order history
      .then(response => this.props.setAppOrderHistoryState(response))
      .catch(console.error)
  }

  render () {
    // locate and assign current cart
    const cart = this.props.orders.find(order => order.status === 'cart')

    const getProductUrl = productId => {
      // find product with productId and return the product imgUrl
      const product = this.props.products.find(product => product._id === productId)
      return product.imgUrl
    }

    const orderItemJSX = (
      cart.orderItems.map(orderItem => (
        <tr key={orderItem._id}>
          <td><ProductImg src={getProductUrl(orderItem.productId)} alt={orderItem.productName} /></td>
          <td>{orderItem.productName}</td>
          <td>${orderItem.price.toFixed(2)}</td>
          <td>{orderItem.quantity}</td>
          <td>${(orderItem.price * orderItem.quantity).toFixed(2)}</td>
          <td>
            <button
              type='button'
              onClick={() => this.handleDeleteOrderItem(cart._id, orderItem._id)}>
              X
            </button>
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
              <th>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {orderItemJSX}
            {rowTotal}
          </tbody>
        </Table>
      </Fragment>
    )
  }
}

const ProductImg = styled.img`
  width: 40px;
  height: 40px;
`

export default withRouter(Cart)
