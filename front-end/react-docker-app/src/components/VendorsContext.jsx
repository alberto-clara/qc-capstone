import React from 'react'

const VendorContext = React.createContext({})

export const VendorProvider = VendorContext.Provider
export const VendorConsumer = VendorContext.Consumer
export default VendorContext