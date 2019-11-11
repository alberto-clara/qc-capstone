import { Row } from 'react-bootstrap';
import React from 'react';
import NavMenu from './NavMenu'
export default props => (
    <Row>
        <NavMenu />
            {props.children}
    </Row>
);