import { Row } from 'react-bootstrap';
import React from 'react';
import NavTitle from './NavTitle';
import NavMenu from './NavMenu';

export default props => (
    <Row>
        <NavTitle />
        <NavMenu />
            {props.children}
    </Row>
);