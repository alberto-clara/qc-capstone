import React, { useState,useEffect } from 'react';
import '../css/mainTailwind.css';
import FireBaseSetup from "../FireBaseSetup";

export function Home() {
    const [name, setName] = useState('');
    const hometry = (<div>
        <div className="text text-red-500 text-center font-black" >Hello, HomeDepot!</div>
        <div>{name}</div>
    </div>);
    return  (
        <div>
            {hometry}
        </div>
    );

}

