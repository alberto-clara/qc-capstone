import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

export default props => ( 
    <Navbar>
        <Navbar bg="light" expand= "lg">
            <Navbar.Brand>
                <Link to={'/'}>HomeDepotBrand</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
    
            <Nav>
                <Link to={'/'} exact>
                    <NavItem> Home</NavItem>      
                </Link>
            </Nav>

            <Nav>
                <Link to={'/signinpage'}>
                    <NavItem> Sign In Page</NavItem>
                </Link>
            </Nav>
        </Navbar>
    </Navbar>
    );