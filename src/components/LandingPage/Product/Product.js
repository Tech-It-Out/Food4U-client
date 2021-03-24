import React, { Component, Fragment } from 'react'

class Product extends Component {
  render () {
    return (
      <Fragment>
        <p>{this.props.name}</p>
        <p>{this.props.description}</p>
        <p>{this.props.price}</p>
        <p>{this.props.imgUrl}</p>
      </Fragment>
    )
  }
}

export default Product
