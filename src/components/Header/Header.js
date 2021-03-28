import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const authenticatedOptions = (
  <Fragment>
    <NavDropdown title="Account" id="basic-nav-dropdown">
      <NavDropdown.Item href="#about-me">About Me</NavDropdown.Item>
      <NavDropdown.Item href="#change-password">Security</NavDropdown.Item>
      <NavDropdown.Item href="#sign-out">Sign Out</NavDropdown.Item>
    </NavDropdown>
    <Nav.Link href="#orders">Orders</Nav.Link>
    <Nav.Link href="#cart"><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
  </Fragment>
)

const unauthenticatedOptions = (
  <Fragment>
    <Nav.Link href="#sign-up">Sign Up</Nav.Link>
    <Nav.Link href="#sign-in">Sign In</Nav.Link>
  </Fragment>
)

const alwaysOptions = (
  <Fragment>
    <Nav.Link href="#about-us">About Us</Nav.Link>
  </Fragment>
)
// handleCartNum = () => {
//   console.log(this.props)
// }
const Header = ({ user, orders }) => (
  <Navbar bg="primary" variant="dark" expand="md">
    <Navbar.Brand href="#">
      Food4U
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        { user && <span className="navbar-text mr-2">{user.firstName ? `Welcome, ${user.firstName}` : ''}</span>}
        { alwaysOptions }
        {console.log('orders data: ', orders.filter(order => order.status == 'cart'))}
        {/* {orders.filter(order => {
          const cart = order.status === 'cart'
          return cart.orderItems.length
        })} */}
        { user ? authenticatedOptions : unauthenticatedOptions }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Header
