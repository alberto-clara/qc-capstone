import { Col, Row } from 'react-bootstrap';
import React from 'react';
import NavMenu from './NavMenu'
export default props => (
    <Row>
        <NavMenu />
        <Col sm={1} />

        <Col sm={10}>
            {props.children}
        </Col>
    </Row>
);