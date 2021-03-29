import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
// import Table from 'react-bootstrap/Table'
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

    // sort order items alphabetically
    const orderItems = cart.orderItems.sort((a, b) => {
      return a.productName.localeCompare(b.productName)
    })

    const orderItemJSX = (
      orderItems.map(orderItem => (
        <tr key={orderItem._id}>
          <td><ProductImg src={getProductUrl(orderItem.productId)} alt={orderItem.productName} /></td>
          <td>{orderItem.productName}</td>
          <td>${orderItem.price.toFixed(2)}</td>
          <td>{orderItem.quantity}</td>
          <td>${(orderItem.price * orderItem.quantity).toFixed(2)}</td>
          <td>
            <IncreaseQuantity onClick={() => handleAddProductEvent(getProduct(orderItem.productId), 1)}>▲</IncreaseQuantity>
            <DeleteItem onClick={() => handleDeleteOrderItem(cart._id, orderItem._id)}>x</DeleteItem>
            <ReduceQuantity onClick={() => handleAddProductEvent(getProduct(orderItem.productId), -1)}>▼</ReduceQuantity>
          </td>
        </tr>
      ))
    )

    const rowTotal = (
      <tr>
        <td colSpan='3'></td>
        <th>Total</th>
        <th>${cart.orderItems.reduce((acc, newVal) => {
          return acc + newVal.price * newVal.quantity
        }, 0).toFixed(2)}
        </th>
        <th></th>
      </tr>
    )

    const fullCartJSX = (
      <Fragment>
        <Table className='table table-hover table-responsive-sm'>
          <thead>
            <tr>
              <th colSpan='2'>Item</th>
              <th>Price</th>
              <th>Items</th>
              <th>Total</th>
              <th></th>
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

    const emptyCartJSX = (
      <p>Your cart is currently empty. Please click on the logo top left to pick items you want to add to the cart.</p>
    )

    const cartJSX = cart.orderItems.length ? fullCartJSX : emptyCartJSX

    return (
      <Fragment>
        <div className="row">
          <div className="col-sm-12 col-md-10 mx-auto mt-5">
            <H3>Your Cart</H3>
            {cartJSX}
          </div>
        </div>
      </Fragment>
    )
  }
}

const H3 = styled.h3`
  margin: 40px 0 20px;
`

const ProductImg = styled.img`
  width: 40px;
  height: 40px;
`

const ReduceQuantity = styled.div`
  margin: 5px auto;
  color: rgb(146,0,46);
  border: none;
  border-radius: 10px;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  padding: 0;
  transition: background-color 0.2s ease-in, color 0.2s ease-in;
  &:hover {
    background-color: rgb(146,0,46);
    color: rgb(255,255,255);
    cursor: pointer;
  }
`

const DeleteItem = styled(ReduceQuantity)`
  background-color: rgba(146,0,46,0.5);
  color: white;
  &:hover {
    background-color: rgb(146,0,46)
  }
`

const IncreaseQuantity = styled(ReduceQuantity)`
  color: darkolivegreen;
  border-color: darkolivegreen;
  &:hover {
    background-color: darkolivegreen;
  }
`

const Table = styled.table`
  table-layout: fixed;
  border: none;

  th {
    letter-spacing: 2px;
    background-color: rgb(146,0,46);
    color: white;
    font-weight: bold;
  }

  thead th:nth-child(1) {
    width: 36%;
    text-align: center;
  }

  thead th:nth-child(2) {
    width: 16%;
    text-align: center;
  }

  thead th:nth-child(3) {
    width: 16%;
    text-align: center;
  }

  thead th:nth-child(4) {
    width: 22%;
    text-align: center;
  }

  thead th:nth-child(5) {
    width: 10%;
    text-align: center;
    padding: 0;
    margin: 0;
  }

  th, td {
    padding: 15px;
    border: none;
  }


  td {
    letter-spacing: 1px;
    vertical-align: middle;
  }

  tbody,
  td {
    text-align: center;
  }
  
  td:nth-child(1) {
    text-align: right;
  }

  td:nth-child(2) {
    text-align: left;
  }

  td:nth-child(6) {
    margin: 0;
    padding: 0;
  }

  tbody tr:nth-child(odd) {
    background-color: rgb(240,231,234);
  }
  
  td[colspan='3'] {
    background-color: rgb(240,231,234);
  }

  tbody tr:nth-child(even) {
    background-color: white;
  }
`

export default withRouter(Cart)
