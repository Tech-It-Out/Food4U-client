import React, { Component, Fragment } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
// query-string lib could not be minified by NPM for deployment
// import queryString from 'query-string'
// replace query-string with querystringify
import qs from 'querystringify'
import _ from 'lodash'

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
  createNewOrder,
  updateOrderStatus,
  deleteOrderItem
} from './api/orders'
import { getUserDataFromAPI, signIn, signUp } from './api/auth'
import EasySignInModal from './components/Modal/Modal'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      orders: null,
      product: null,
      stripeCheckout: null,
      msgAlerts: [],
      isModal: false,
      email: '',
      password: '',
      passwordConfirmation: ''
    }
    this.hydrateState()
  }

  componentDidMount () {
    // make axios call to get the products...
    getProductsFromApi()
      // ...sort products alphabetically...
      .then(res => {
        // sort products array by product name in alphabetically ascending order
        return res.data.products.sort(function (a, b) {
          return a.name.localeCompare(b.name)
        })
      })
      // ...and set products to state such that they are displayed on landing page
      .then(products => {
        this.setState({
          products: products
        })
      })
      .then(() => {
        // display modal that offers users to sign-in with a mock-account after a short break
        setTimeout(() => {
          this.setState({
            isModal: true
          })
        }, 1000)
      })
      .catch()

    // if user is logged in, get order history from api and update state
    if (this.state.user) {
      getOrderHistoryFromAPI(this.state.user.token)
        .then(response => this.setAppOrderHistoryState(response))
        .catch()
    }
  }

  hydrateState = () => {
    const token = window.sessionStorage.getItem('token')
    if (token) {
      // console.log('1: get user data with token')
      getUserDataFromAPI(token)
        // get user data from api and set state
        .then(res => {
          // console.log('2: set state with user data')
          this.setState({ user: res.data.user })
        })
        // get orders from api and set state
        .then(() => {
          // console.log('3: get order history from api')
          return getOrderHistoryFromAPI(token)
        })
        .then(res => {
          // console.log('4: set state with order history')
          this.setState({ orders: res.data.orders })
        })
        .then(() => {
          // console.log('5: retrieve query object after Stripe redirect back to client')
          const queryStringObj = this.getQueryStringObj()
          // console.log(queryStringObj)
          if (!_.isEmpty(queryStringObj)) {
            const checkout = queryStringObj.checkout
            // set state stripeCheckout to the result of the checkout
            this.setState({ stripeCheckout: checkout })
          }
        })
        .then(() => {
          // console.log('6: if stripe was successful...')
          // if stripe checkout was successful...
          if (this.state.stripeCheckout === 'success') {
            // ... create new order with status cart
            // console.log('7: create new order with status cart')
            return createNewOrder(this.state.user.token)
              .then(() => {
                // console.log('8: find first order with status cart from order history state')
                const cart = this.state.orders.find(order => order.status === 'cart')
                // ...update order history by setting order status to complete
                // console.log('9: update order with status cart to status complete')
                return updateOrderStatus(this.state.user.token, cart._id, 'complete')
              })
              // ... re-update order history and set state...
              .then((res) => {
                // console.log('10: retrieve latest order history again after successful order history update')
                return getOrderHistoryFromAPI(this.state.user.token)
              })
              .then(res => {
                // console.log('11: set orders state with updated order history')
                return this.setState({ orders: res.data.orders })
              })
              .then(() => {
                // finally, reset stripeCheckout state to null and reset session storage
                // console.log('12: reset stripeCheckout state and session storage')
                this.setState({ stripeCheckout: null })
                // console.log('13: redirect browser to either /orders or /cart depending on result of Stripe payment')
                const { history } = this.props
                history.push('/orders')
              })
              .then(() => {
                // customer messaging
                this.msgAlert({
                  heading: 'Payment Confirmation',
                  message: messages.paymentConfirmed,
                  variant: 'info'
                })
              })
              .catch()
          }
          if (this.state.stripeCheckout === 'failure') {
            // finally, reset stripeCheckout state to null and reset session storage
            // console.log('12: reset stripeCheckout state and session storage')
            this.setState({ stripeCheckout: null })
            // console.log('13: redirect browser to either /orders or /cart depending on result of Stripe payment')
            const { history } = this.props
            history.push('/cart')
            // customer messaging
            this.msgAlert({
              heading: 'Payment Unsuccessful',
              message: messages.paymentUnsuccessful,
              variant: 'warning'
            })
          }
        })
    }
  }

  setUser = user => {
    this.setState({ user })
    // store the token in session storage for persistence after Stripe checkout
    window.sessionStorage.setItem('token', user.token)
  }

  clearUser = () => this.setState({ user: null })

  getUserTokenFromAppState = () => this.state.user.token

  setAppOrderHistoryState = (response) => {
    this.setState({
      orders: response.data.orders
    })
  }

  handleAddProductEvent = (product, quantityAdder) => {
    const { user, orders } = this.state
    // before checking the order history for products, get the latest order history from API
    if (user) {
      // find cart from order history
      const cart = orders.find(order => order.status === 'cart')
      // check if passed productId matches an order item
      const orderItem = cart.orderItems.find(orderItem => orderItem.productId.toString() === product._id)
      if (orderItem) {
        // If order item with said productId exists: change order item quantity by quantityAdder
        if (orderItem.quantity === 1 && quantityAdder === -1) {
          // display customer alert
          this.msgAlert({
            heading: 'Delete item?',
            message: messages.clickDeleteItem,
            variant: 'info'
          })
        } else {
          updateOrderItemWithQuantity(orderItem.quantity + quantityAdder, cart._id, orderItem._id, user.token)
            // Update order history and set state in APP component
            .then(() => getOrderHistoryFromAPI(user.token))
            .then(res => this.setAppOrderHistoryState(res))
            .catch()
        }
      } else {
        // If no order item with said productId exists, create-new-order-item
        createNewOrderItemWithData(cart._id, user.token, product)
          // Update order history and set state in APP component
          .then(() => getOrderHistoryFromAPI(user.token))
          .then(res => this.setAppOrderHistoryState(res))
          .catch()
      }
    } else {
      this.msgAlert({
        heading: 'Please Sign In First',
        message: messages.signInFirst,
        variant: 'info'
      })
    }
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
    return qs.parse(query)
  }

  handleDeleteOrderItem = (orderId, orderItemId) => {
    // 1) send delete orderItem request to API
    deleteOrderItem(orderId, orderItemId, this.state.user.token)
      .then(() => {
        // 2) upon successfully resolving the promise, get updated order history
        return getOrderHistoryFromAPI(this.state.user.token)
      })
      // 3) update state in APP with latest order history
      .then(response => this.setAppOrderHistoryState(response))
      .catch()
  }

  handleCloseModal = () => {
    this.setState({
      isModal: false
    })
  }

  handleExpeditedSignUp = () => {
    Promise.resolve()
      .then(() => this.setRandomSignUpDetails())
      .then(() => this.onSignUp())
      .catch()
  }

  makeRandomString = length => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  setRandomSignUpDetails = () => {
    // sets a random user profile which is needed if users prefer to not sign-in with their email
    const password = this.makeRandomString(5)
    this.setState({
      email: `${this.makeRandomString(10)}@random.com`,
      password: password,
      passwordConfirmation: password
    })
  }

  onSignUp = event => {
    if (event) {
      event.preventDefault()
    }

    signUp(this.state)
      .then(() => signIn(this.state))
      .then(res => this.setUser(res.data.user))
      .then(() => this.msgAlert({
        heading: 'Sign Up Success',
        message: messages.signUpSuccess,
        variant: 'success'
      }))
      .then(() => this.props.history.push('/'))
      .then(() => createNewOrder(this.state.user.token))
      .then(() => getOrderHistoryFromAPI(this.state.user.token))
      .then(orders => this.setAppOrderHistoryState(orders))
      .catch(error => {
        this.setState({ email: '', password: '', passwordConfirmation: '' })
        this.msgAlert({
          heading: 'Sign Up Failed with error: ' + error.message,
          message: messages.signUpFailure,
          variant: 'danger'
        })
      })
  }

  handleSignUpFormChange = event => this.setState({
    [event.target.name]: event.target.value
  })

  render () {
    const { msgAlerts, user, orders, products, isModal } = this.state
    return (
      <Fragment>
        <Header user={user} orders={orders} />
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
          <EasySignInModal
            isModal={isModal}
            user={user}
            handleCloseModal={this.handleCloseModal}
            handleExpeditedSignUp={this.handleExpeditedSignUp}
          />
          <Route exact path='/' render={() => (
            <LandingPage
              handleAddProductEvent={this.handleAddProductEvent}
              products={products}
              orders={orders}
              user={user}
              handleDeleteOrderItem={this.handleDeleteOrderItem}
            />
          )}/>
          <Route path='/sign-up' render={() => (
            <SignUp
              msgAlert={this.msgAlert}
              setUser={this.setUser}
              setAppOrderHistoryState={this.setAppOrderHistoryState}
              getUserTokenFromAppState={this.getUserTokenFromAppState}
              onSignUp={this.onSignUp}
              handleSignUpFormChange={this.handleSignUpFormChange}
              email={this.state.email}
              password={this.state.password}
              passwordConfirmation={this.state.passwordConfirmation}
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
              handleDeleteOrderItem={this.handleDeleteOrderItem}
              handleAddProductEvent={this.handleAddProductEvent}
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
