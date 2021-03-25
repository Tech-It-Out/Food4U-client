import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

// import { getOrders } from '../../api/auth'
// import messages from '../AutoDismissAlert/messages'

// import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'

class Orders extends Component {
  constructor (props) {
    super(props)

    this.state = {
      date: '',
      products: '',
      cost: null,
      orderItems: []
    }
  }

  // handleChange = event => this.setState({
  //   [event.target.name]: event.target.value
  // })

  render () {
    const { orders } = this.props
    const completedOrders = orders.filter(order => order.status === 'complete')
    console.log('completedOrders data: ', completedOrders)
    const itemsPrice = []
    const costs = completedOrders.map(order => {
      order.orderItems.map(items => {
        console.log('items data', items)
        itemsPrice.push(items.quantity * items.price)
        console.log('itemsPrice array: ', itemsPrice)
      })
      console.log('order.orderitems info: ', order.orderItems)
    })
    console.log('costs data info: ', costs)
    if (completedOrders.length === 0) {
      return <h2>No complete orders</h2>
    } else {
      const ordersJsx = (
        completedOrders.map(order => (
          <Fragment key={order._id}>
            <tr>
              <td>{order.updatedAt}</td>
              <td>{order.orderItems.length}</td>
              <td>${order.orderItems[0].price}</td>
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
