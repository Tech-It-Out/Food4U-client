import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import Moment from 'react-moment'
import styled from 'styled-components'

class Orders extends Component {
  render () {
    const { orders } = this.props
    const completeOrders = orders.filter(order => order.status === 'complete')
    const completedOrders = _.reverse(completeOrders)
    if (completedOrders.length === 0) {
      return (
        <Fragment>
          <div className="row">
            <div className="col-sm-12 col-md-10 mx-auto mt-5">
              <H3>Your Previous Orders</H3>
              <p>You do not have any previous orders at the moment.</p>
            </div>
          </div>
        </Fragment>
      )
    } else {
      const ordersJsx = (
        completedOrders.map(order => (
          <Fragment key={order._id}>
            <tr>
              <td><Moment format='DD-MMM-YYYY' >{order.updatedAt}</Moment></td>
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
          <div className="col-sm-12 col-md-10 mx-auto mt-5">
            <H3>Your Previous Orders</H3>
            <Table>
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
        </div>
      )
    }
  }
}

const H3 = styled.h3`
  margin: 40px 0 20px;
`

const Table = styled.table`
  table-layout: fixed;
  border: none;
  margin-bottom: 60px;

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

  tbody tr:nth-child(odd) {
    background-color: rgb(240,231,234);
  }
  
  tbody tr:nth-child(even) {
    background-color: white;
  }
`

export default withRouter(Orders)
