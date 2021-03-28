import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import styled from 'styled-components'

const authenticatedOptions = orderItemsCount => (
  <Fragment>
    <NavDropdown title="Account" id="basic-nav-dropdown">
      <NavDropdown.Item href="#about-me">About Me</NavDropdown.Item>
      <NavDropdown.Item href="#change-password">Security</NavDropdown.Item>
      <NavDropdown.Item href="#sign-out">Sign Out</NavDropdown.Item>
    </NavDropdown>
    <Nav.Link href="#orders">Orders</Nav.Link>
    <Nav.Link href="#cart"><i className='fas fa-shopping-cart'></i>&nbsp;Cart ({orderItemsCount})</Nav.Link>
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

function getOrderItemsCount (orders) {
  if (orders) {
    const cart = orders.find(order => order.status === 'cart')
    return cart.orderItems.length
  }
}

const Header = ({ user, orders }) => (
  <NavbarStyled bg="light" variant="light" expand="md">
    <Navbar.Brand href="#">
      Food4U
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        { user && <span className="navbar-text mr-2">{user.firstName ? `Welcome, ${user.firstName}` : ''}</span>}
        { alwaysOptions }
        { user ? authenticatedOptions(getOrderItemsCount(orders)) : unauthenticatedOptions }
      </Nav>
    </Navbar.Collapse>
  </NavbarStyled>
)

const NavbarStyled = styled(Navbar)`
  box-shadow: 0 3px 7px 1px rgba(0,0,0,.07),0 -3px 7px 1px rgba(0,0,0,.07);
`

export default Header
