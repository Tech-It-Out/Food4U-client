import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getProductsFromApi } from '../../api/products'

class Cart extends Component {
  constructor (props) {
    super(props)

    this.state = {
      products: null
    }
  }

  // todo: products are already saved in the LandingPage state - perhaps save them in APP instead
  componentDidMount () {
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

  render () {
    return (
      <div className="row">
        <h1>Cart Page</h1>
      </div>
    )
  }
}

export default withRouter(Cart)
