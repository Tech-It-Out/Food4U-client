import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

// import { getOrders } from '../../api/auth'
// import messages from '../AutoDismissAlert/messages'

// import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'

class Orders extends Component {
  constructor (props) {
    super(props)

    this.state = {
      oldPassword: '',
      newPassword: ''
    }
  }

  // handleChange = event => this.setState({
  //   [event.target.name]: event.target.value
  // })

  // onChangePassword = event => {
  //   event.preventDefault()

  //   const { msgAlert, history, user } = this.props

  //   changePassword(this.state, user)
  //     .then(() => msgAlert({
  //       heading: 'Change Password Success',
  //       message: messages.changePasswordSuccess,
  //       variant: 'success'
  //     }))
  //     .then(() => history.push('/'))
  //     .catch(error => {
  //       this.setState({ oldPassword: '', newPassword: '' })
  //       msgAlert({
  //         heading: 'Change Password Failed with error: ' + error.message,
  //         message: messages.changePasswordFailure,
  //         variant: 'danger'
  //       })
  //     })
  // }

  render () {
    // const { oldPassword, newPassword } = this.state

    return (
      <div className="row">
        <h1>Orders Page</h1>
      </div>
    )
  }
}

export default withRouter(Orders)
