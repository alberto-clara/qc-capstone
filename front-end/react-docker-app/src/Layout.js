import { Row } from 'react-bootstrap';
import React from 'react';
import NavTitle from './NavTitle';
import NavMenu from './NavMenu';

export default props => (
    <Row>
        <div className="bg-orange-500 max-w-full">
            <div className="flex justify-center">
                <div className="flex-1 bg-green-500 max-w-6xl">
                    <NavTitle />
                </div>
            </div>
        </div>
        <div className="bg-orange-600 max-w-full">
            <div className="flex justify-center">
                <div className="flex-1 bg-purple-400 max-w-6xl">
                    <NavMenu />
                </div>
            </div>
        </div>
        <div className="flex justify-center px-4 lg:px-0">
        <div className="bg-gray-300 max-w-6xl">
            {props.children}
            </div>
            </div>
    </Row>
);