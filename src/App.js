import React, { Component, Fragment } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import queryString from 'query-string'
// import _ from 'lodash'

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
import { getProductsFromApi } from './api/products'
import {
  getOrderHistoryFromAPI,
  updateOrderItemWithQuantity,
  createNewOrderItemWithData,
  createNewOrder
} from './api/orders'
import { getUserDataFromAPI } from './api/auth'

class App extends Component {
  constructor (props) {
    super(props)
    this.path = window.location.hash
    this.state = {
      user: null,
      orders: null,
      product: null,
      path: null,
      msgAlerts: []
    }
    this.hydrateState()
    this.pushToHistoryAfterRedirect()
  }

  hydrateState = () => {
    const token = window.sessionStorage.getItem('token')
    if (token) {
      // get user data from api and set state
      getUserDataFromAPI(token)
        .then(res => {
          this.setState({ user: res.data.user })
        })
        .catch(console.error)
      // get orders from api and set state
      getOrderHistoryFromAPI(token)
        .then(res => {
          this.setState({ orders: res.data.orders })
        })
        .catch(console.error)
    }

    // make axios call to set the products state
    getProductsFromApi()
      .then(response => {
        // sort products array by product name in alphabetically ascending order
        return response.data.products.sort(function (a, b) {
          return a.name.localeCompare(b.name)
        })
      })
      .then(products => {
        this.setState({
          products: products
        })
      })
      .catch(console.error)
  }

  setUser = user => {
    this.setState({ user })
    window.sessionStorage.setItem('token', user.token)
    console.log(user.token)
  }

  clearUser = () => this.setState({ user: null })

  getUserTokenFromAppState = () => this.state.user.token

  setAppOrderHistoryState = (response) => {
    this.setState({
      orders: response.data.orders
    })
  }

  handleAddProductEvent = (product) => {
    // before checking the order history for products, get the latest order history from API
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
                // Update order history and set state in APP component
                .then(() => getOrderHistoryFromAPI(this.state.user.token))
                .then(response => this.setAppOrderHistoryState(response))
                .catch(console.error)
            } else {
              // If no: send create-new-order-item request to API
              createNewOrderItemWithData(cart._id, this.state.user.token, product)
                // Update order history and set state in APP component
                .then(() => getOrderHistoryFromAPI(this.state.user.token))
                .then(response => this.setAppOrderHistoryState(response))
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

  getQueryStringObj = () => {
    // get query string from withRouter browser history
    const query = this.props.history.location.search
    // use queryString library to parse query string into an object with key: value pairs
    return queryString.parse(query)
  }

  pushToHistoryAfterRedirect = () => {
    if (this.path === '#/cart') {
      this.setState({ path: this.path })
      this.props.history.push('/cart')
      console.log(this.state)
    }
  }

  render () {
    const { msgAlerts, user, orders, products } = this.state
    console.log(this.props.history.location)
    console.log(this.path)

    // let landingPageJSX = ''
    // const queryStringObj = this.getQueryStringObj()
    // // const path = this.props.history.location.pathname
    //
    // if (_.isEmpty(queryStringObj)) {
    //   landingPageJSX = (
    //     <Route exact path='/' render={() => (
    //       <LandingPage
    //         handleAddProductEvent={this.handleAddProductEvent}
    //         products={this.state.products}
    //       />
    //     )}/>
    //   )
    // } else if (queryStringObj.payment === 'failure') {
    //   landingPageJSX = (
    //     <Redirect to='/cart' />
    //   )
    // } else if (queryStringObj.payment === 'success') {
    //   landingPageJSX = (
    //     <Redirect to='/orders' />
    //   )
    // }

    // if home route '/' contains query string 'payment=failure'
    // show appropriate user message and redirect to cart

    // if home route '/' contains query string 'payment=success'
    // show appropriate user message and redirect to orders

    // if home route '/' has no query strings then show Landing Page

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
              products={this.state.products}
            />
          )}/>
          <Route path='/sign-up' render={() => (
            <SignUp
              msgAlert={this.msgAlert}
              setUser={this.setUser}
              setAppOrderHistoryState={this.setAppOrderHistoryState}
              getUserTokenFromAppState={this.getUserTokenFromAppState}
            />
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
            <Cart
              user={user}
              orders={orders}
              products={products}
              setAppOrderHistoryState={this.setAppOrderHistoryState}
            />
          )} />
          <AuthenticatedRoute user={user} path='/about-me' render={() => (
            <AboutMe msgAlert={this.msgAlert} user={user} setUser={this.setUser} />
          )} />
        </main>
      </Fragment>
    )
  }
}

export default withRouter(App)
