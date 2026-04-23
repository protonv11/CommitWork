import React, { createContext, useContext, useState } from "react"

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [state, setState] = useState({
    address: null,
    isConnected: false,
    balance: "0.00",
    chainId: null
  })
  const [connecting, setConnecting] = useState(false)

  async function connectWallet() {
    setConnecting(true)
    await new Promise(r => setTimeout(r, 900))
    setState({
      address: "0xE5F6G7H8I9J0E5F6",
      isConnected: true,
      balance: "4.82",
      chainId: 11155111
    })
    setConnecting(false)
  }

  function disconnectWallet() {
    setState({ address:null, isConnected:false, balance:"0.00", chainId:null })
  }

  return (
    <WalletContext.Provider value={{
      ...state, connecting, connectWallet, disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider")
  return ctx
}
