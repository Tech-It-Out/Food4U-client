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
      user: {
        firstName: '',
        surname: '',
        street: '',
        apartment: '',
        state: '',
        country: ''
      },
      updated: false
    }
  }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })

  onUpdateUser = event => {
    event.preventDefault()

    const { msgAlert, history, user, setUser } = this.props

    updateUser(this.state, user)
      .then(res => setUser(res.data.user))
      .then(() => msgAlert({
        heading: 'You have successfully updated your profile',
        variant: 'success'
      }))
      .then(() => history.push('/'))
      .catch(error => {
        this.setState({ firstName: '', surname: '', street: '', apartment: '', state: '', country: '' })
        msgAlert({
          heading: 'Profile update failed! See error: ' + error.message,
          message: messages.changePasswordFailure,
          variant: 'danger'
        })
      })
  }

  render () {
    const { firstName, surname, street, apartment, state, country } = this.state
    const { user } = this.props
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
                placeholder={user.firstName}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="surname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="surname"
                value={surname}
                type="text"
                placeholder={user.surname}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="street">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                name="street"
                value={street}
                type="text"
                placeholder={user.street}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="apartment">
              <Form.Label>Apartment</Form.Label>
              <Form.Control
                name="apartment"
                value={apartment}
                type="text"
                placeholder={user.apartment}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                name="state"
                value={state}
                type="text"
                placeholder={user.state}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                name="country"
                value={country}
                type="text"
                placeholder={user.country}
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
