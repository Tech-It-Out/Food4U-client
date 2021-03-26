import React, { Component } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import apiUrl from '../../../apiConfig'

class StripeButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  componentDidMount () {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)

    if (query.get('success')) {
      this.setState('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      this.setState(
        'Order canceled -- continue to shop around and checkout when you\'re ready.'
      )
    }
  }

  handleClick = async () => {
    const stripePromise = loadStripe('pk_test_51IZJoXB0yfyrGtyK2QhYGE8ewvoGXa3UAp8U5Gzd788GGT62GYHspWAYFnzYzasjCkT8KgVRPNtF1Uys6V59AEBh0015fGpJ2d')
    const stripe = await stripePromise

    const response = await fetch(apiUrl + '/create-checkout-session', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      }
    })

    const session = await response.json()

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    })

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // todo: set-up customer facing error message
      console.log(result.error.message)
    }
  }

  render () {
    const Button = ({ handleClick }) => (
      <button type="button" id="checkout-button" role="link" onClick={handleClick}>
        Checkout
      </button>
    )

    const Message = ({ message }) => (
      <section>
        <p>{message}</p>
      </section>
    )

    return this.state.message ? <Message message={this.state.message} /> : <Button handleClick={this.handleClick} />
  }
}

export default StripeButton
