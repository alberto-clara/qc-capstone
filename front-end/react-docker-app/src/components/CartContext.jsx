import React, { createContext } from 'react'

const CartContext = createContext()

export const CartProvider = CartContext.Provider
export const CartConsumer = CartContext.Consumer
export default CartContext