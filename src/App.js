import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from './components/AutoDismissAlert/AutoDismissAlert'
import Header from './components/Header/Header'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import SignOut from './components/SignOut/SignOut'
import ChangePassword from './components/ChangePassword/ChangePassword'
import Orders from './components/Orders/Orders'
import Cart from './components/Cart/Cart'
import AboutUs from './components/AboutUs/AboutUs'
import AboutMe from './components/AboutMe/AboutMe'
import LandingPage from './components/LandingPage/LandingPage'
import messages from './components/AutoDismissAlert/messages'
import {
  getOrderHistoryFromAPI,
  updateOrderItemWithQuantity,
  createNewOrderItemWithData,
  createNewOrder
} from './api/orders'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      orders: null,
      msgAlerts: []
    }
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  getUserTokenFromAppState = () => this.state.user.token

  setAppOrderHistoryState = (response) => {
    this.setState({
      orders: response.data.orders
    })
  }

  handleAddProductEvent = (product) => {
    // before checking the order history for products, get the latest order hsitory from API
    getOrderHistoryFromAPI(this.state.user.token)
      .then(response => this.setAppOrderHistoryState(response))
      .then(() => {
        const cart = this.state.orders.find(order => order.status === 'cart')
        if (this.state.user) {
          // Check if orders contain order with property status === cart
          // If no such order exists, send create-new-order request to API
          if (cart) {
            // If cart order exists, check if passed productId matches an order item
            const orderItem = cart.orderItems.find(orderItem => orderItem.productId.toString() === product._id)
            if (orderItem) {
              // If yes: increment said order item quantity by 1
              updateOrderItemWithQuantity(orderItem.quantity + 1, cart._id, orderItem._id, this.state.user.token)
                .then(console.log)
                .catch(console.error)
            } else {
              // If no: send create-new-order-item request to API
              createNewOrderItemWithData(cart._id, this.state.user.token, product)
                .then(console.log)
                .catch(console.error)
            }
          } else {
            // Create new order with status cart
            createNewOrder(this.state.user.token)
              .then(() => {
                // Create new order-item
                return createNewOrderItemWithData(cart._id, this.state.user.token, product)
              })
              .catch(console.error)
          }
        } else {
          this.msgAlert({
            heading: 'Please Sign In First',
            message: messages.signInFirst,
            variant: 'info'
          })
        }
      })
      .catch(console.error)
  }

  deleteAlert = (id) => {
    this.setState((state) => {
      return { msgAlerts: state.msgAlerts.filter(msg => msg.id !== id) }
    })
  }

  msgAlert = ({ heading, message, variant }) => {
    const id = uuid()
    this.setState((state) => {
      return { msgAlerts: [...state.msgAlerts, { heading, message, variant, id }] }
    })
  }

  render () {
    const { msgAlerts, user, orders } = this.state

    return (
      <Fragment>
        <Header user={user} />
        {msgAlerts.map(msgAlert => (
          <AutoDismissAlert
            key={msgAlert.id}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
            id={msgAlert.id}
            deleteAlert={this.deleteAlert}
          />
        ))}
        <main className="container">
          <Route exact path='/' render={() => (
            <LandingPage
              handleAddProductEvent={this.handleAddProductEvent}
            />
          )} />
          <Route path='/sign-up' render={() => (
            <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn
              msgAlert={this.msgAlert}
              setUser={this.setUser}
              getUserTokenFromAppState={this.getUserTokenFromAppState}
              setAppOrderHistoryState={this.setAppOrderHistoryState}
            />
          )} />
          <Route path='/about-us' render={() => (
            <AboutUs setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/orders' render={() => (
            <Orders user={user} orders={orders} />
          )} />
          <AuthenticatedRoute user={user} path='/cart' render={() => (
            <Cart user={user} orders={orders}  />
          )} />
          <AuthenticatedRoute user={user} path='/about-me' render={() => (
            <AboutMe msgAlert={this.msgAlert} user={user} />
          )} />
        </main>
      </Fragment>
    )
  }
}

export default App
