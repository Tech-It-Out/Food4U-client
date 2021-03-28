import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import _ from 'lodash'
// import messages from '../AutoDismissAlert/messages'
// import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'

class Orders extends Component {
  render () {
    const { orders } = this.props
    const completeOrders = orders.filter(order => order.status === 'complete')
    const completedOrders = _.reverse(completeOrders)
    if (completedOrders.length === 0) {
      return <h2>No complete orders</h2>
    } else {
      const ordersJsx = (
        completedOrders.map(order => (
          <Fragment key={order._id}>
            <tr>
              <td>{order.updatedAt}</td>
              <td>{order.orderItems.length}</td>
              <td>${order.orderItems.reduce((acc, currentValue) => {
                return acc + (currentValue.price * currentValue.quantity)
              }, 0).toFixed(2)}
              </td>
            </tr>
          </Fragment>
        ))
      )
      return (
        <div className="row">
          <h1>Orders Page</h1>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Date</th>
                <th>Products</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              { ordersJsx }
            </tbody>
          </Table>
        </div>
      )
    }
  }
}

export default withRouter(Orders)
