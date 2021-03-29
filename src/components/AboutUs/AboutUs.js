import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

class AboutUs extends Component {
  render () {
    // const { oldPassword, newPassword } = this.state

    return (
      <div className="row">
        <div className="col-sm-12 col-md-10 mx-auto mt-5">
          <H3>About Us</H3>
          <P>We pride ourselves in delivering <b>fresh produce</b> to your home! All our products are sourced exclusively
            from <b>local farmers</b>. Which has the added benefit of being <b>environmentally friendly</b>. Our produce is <b>local and
            seasonal</b> so please bear with us if items are currently unavailable - our farmers are working hard on
            the next harvest! It goes without saying that all our farmers are <b>exclusively No-GMO</b> and all produce is
            certified <b>organic</b>.</P>
          <br />
          <P> Save time by shopping on our app and we will deliver the products right to your home.
            We use Stripe to process your payment.</P>
        </div>
      </div>
    )
  }
}

const H3 = styled.h3`
  margin: 40px 0 20px;
`

const P = styled.p`
  text-align: justify;
`

export default withRouter(AboutUs)
