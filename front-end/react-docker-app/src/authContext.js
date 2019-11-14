import React, { createContext, useReducer } from 'react';
import { firebaseAuth } from "./reducer";
export const Auth = createContext();
const initialState = {
    user: {}
}

export const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(firebaseAuth, initialState);
    const value = { state, dispatch };

    return <Auth.Provider value={value}>
                {props.children}
            </Auth.Provider>
}