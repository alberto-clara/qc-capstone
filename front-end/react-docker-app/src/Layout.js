import { Row } from 'react-bootstrap';
import React from 'react';
import NavTitle from './NavTitle';
import NavMenu from './NavMenu';
import SearchBar from './SearchBar';
export default props => (
    <Row>
        <NavTitle />
        <NavMenu />
        <SearchBar/>
            {props.children}
    </Row>
);