import { createContext, useContext, useState, useEffect } from "react"
import { STELLAR_NETWORK } from "../utils/constants"
import {
  isConnected,
  getAddress,
  requestAccess,
  getNetworkDetails,
  WatchWalletChanges,
} from "@stellar/freighter-api"

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [state, setState] = useState({
    address:            null,
    isConnected:        false,
    balance:            "0",
    network:            null,
    freighterInstalled: false,
  })
  const [connecting, setConnecting] = useState(false)

  // On mount: check if already connected and watch for changes
  useEffect(() => {
    const init = async () => {
      try {
        const connResult = await isConnected()
        const installed = connResult?.isConnected === true

        if (installed) {
          setState(p => ({ ...p, freighterInstalled: true }))
          // Try to read the address silently (user already approved)
          const addrResult = await getAddress()
          if (addrResult?.address && !addrResult?.error) {
            const net = await getNetworkDetails().catch(() => null)
            setState(p => ({
              ...p,
              address: addrResult.address,
              isConnected: true,
              network: net?.networkPassphrase || STELLAR_NETWORK.passphrase,
            }))
            fetchBalance(addrResult.address)
          }
        }
      } catch (e) {
        console.warn("[Wallet] Init check failed:", e)
      }
    }

    init()

    // Watch for account / network changes
    let watcher = null
    try {
      watcher = new WatchWalletChanges(4000)
      watcher.watch(({ address, network }) => {
        if (address) {
          setState(p => ({ ...p, address, isConnected: true, network: network || p.network }))
          fetchBalance(address)
        }
      })
    } catch (e) {
      console.warn("[Wallet] WatchWalletChanges not available:", e)
    }

    return () => {
      if (watcher) watcher.stop()
    }
  }, [])

  async function fetchBalance(address) {
    if (!address) return
    try {
      const res = await fetch(`${STELLAR_NETWORK.horizon}/accounts/${address}`)
      if (res.status === 404) {
        setState(p => ({ ...p, balance: "0.00 (Unfunded — get testnet XLM from friendbot)" }))
        return
      }
      const data = await res.json()
      const xlm = data.balances?.find(b => b.asset_type === "native")
      if (xlm) {
        setState(p => ({
          ...p,
          balance: parseFloat(xlm.balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        }))
      }
    } catch (err) {
      console.error("[Wallet] Balance fetch failed:", err)
    }
  }

  async function connectWallet() {
    setConnecting(true)
    try {
      // Step 1: Check if extension is installed
      const connResult = await isConnected()
      if (!connResult?.isConnected) {
        alert("Freighter extension not detected.\n\nPlease install it from: https://freighter.app")
        return
      }

      // Step 2: Request access (this opens the Freighter popup)
      const accessResult = await requestAccess()
      if (accessResult?.error) {
        alert(`Wallet access denied: ${accessResult.error}`)
        return
      }

      const address = accessResult?.address
      if (!address) {
        alert("Could not get wallet address. Is the wallet unlocked?")
        return
      }

      // Step 3: Get network
      const net = await getNetworkDetails().catch(() => ({ networkPassphrase: STELLAR_NETWORK.passphrase }))

      setState({
        address,
        isConnected: true,
        balance: "...",
        network: net.networkPassphrase,
        freighterInstalled: true,
      })

      await fetchBalance(address)
    } catch (err) {
      console.error("[Wallet] connectWallet error:", err)
      alert(`Connection failed: ${err?.message || err}`)
    } finally {
      setConnecting(false)
    }
  }

  function disconnectWallet() {
    setState({
      address: null,
      isConnected: false,
      balance: "0",
      network: null,
      freighterInstalled: state.freighterInstalled,
    })
  }

  return (
    <WalletContext.Provider value={{ ...state, connecting, connectWallet, disconnectWallet, fetchBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => useContext(WalletContext)
