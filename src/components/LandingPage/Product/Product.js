import React, { Component } from 'react'

class Product extends Component {
  render () {
    return (
      <div>
        <p>{this.props.name}</p>
        <p>{this.props.description}</p>
        <p>{this.props.price}</p>
        <p>{this.props.imgUrl}</p>
      </div>
    )
  }
}

export default Product
