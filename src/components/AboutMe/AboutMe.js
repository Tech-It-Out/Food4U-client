import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import { updateUser } from '../../api/auth'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class AboutMe extends Component {
  constructor (props) {
    super(props)

    this.state = {
      firstName: '',
      surname: '',
      street: '',
      apartment: '',
      state: '',
      country: ''
    }
  }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })

  onUpdateUser = event => {
    event.preventDefault()

    const { msgAlert, history, user } = this.props

    updateUser(this.state, user)
      .then(() => msgAlert({
        heading: 'You have successfully updated your profile',
        message: messages.changePasswordSuccess,
        variant: 'success'
      }))
      .then(() => history.push('/'))
      .catch(error => {
        this.setState({ oldPassword: '', newPassword: '' })
        msgAlert({
          heading: 'Profile update failed! See error: ' + error.message,
          message: messages.changePasswordFailure,
          variant: 'danger'
        })
      })
  }

  render () {
    const { firstName, surname, street, apartment, state, country } = this.state

    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 mx-auto mt-5">
          <h3>About Me</h3>
          <Form onSubmit={this.onUpdateUser}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={firstName}
                type="text"
                placeholder="First Name"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="surname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="surname"
                value={surname}
                type="text"
                placeholder="Last Name"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="street">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                name="street"
                value={street}
                type="text"
                placeholder="Street Address"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="apartment">
              <Form.Label>Apartment</Form.Label>
              <Form.Control
                name="apartment"
                value={apartment}
                type="text"
                placeholder="Apartment"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                name="state"
                value={state}
                type="text"
                placeholder="State"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                name="country"
                value={country}
                type="text"
                placeholder="Country"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
            >
            Submit
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(AboutMe)
