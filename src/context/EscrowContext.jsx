import React, { createContext, useContext, useState, useCallback } from "react"
import { MOCK_ESCROWS, MOCK_EVENTS, STELLAR_NETWORK, CONTRACTS } from "../utils/constants"
import { generateId } from "../utils/helpers"

// ── Soroban contract simulation layer ────────────────────────────────────────
// In production, these call the Stellar Soroban RPC with StellarSdk.
// Here they simulate the inter-contract call pattern:
//   EscrowContract.invoke("approve_milestone", ...) 
//     → PlatformUtilityContract.invoke("check_discount", address) 
//       → returns discount %

async function sorobanInvoke(contractId, method, args = {}, delayMs = 1000) {
  await new Promise(r => setTimeout(r, delayMs))
  // Simulate Soroban RPC call log
  console.info(`[Soroban] invoke ${contractId.slice(0,8)}... :: ${method}`, args)
  return { success: true, txHash: "T" + Math.random().toString(36).slice(2,12).toUpperCase() }
}

async function checkDiscount(address) {
  // Simulate inter-contract call: EscrowContract → PlatformUtilityContract
  const result = await sorobanInvoke(CONTRACTS.utility, "check_discount", { address }, 200)
  return result.success ? 10 : 0  // returns discount % from WORK token balance
}

const EscrowContext = createContext(null)

export function EscrowProvider({ children }) {
  const [escrows, setEscrows]         = useState(MOCK_ESCROWS)
  const [events, setEvents]           = useState(MOCK_EVENTS)
  const [notifications, setNotifs]    = useState([])
  const [activeEscrowId, setActiveId] = useState(null)
  const [loading, setLoading]         = useState(false)

  function pushNotif(type, message, escrowId, extra = {}) {
    setNotifs(prev => [{
      id: generateId("NOTIF"), type, message, escrowId,
      timestamp: Date.now(), read: false, ...extra
    }, ...prev])
  }

  function pushEvent(type, escrowId, extra = {}) {
    setEvents(prev => [{
      id: generateId("EV"), type, escrowId,
      timestamp: Date.now(), ...extra
    }, ...prev])
  }

  function updateMilestone(escrowId, milestoneId, patch) {
    setEscrows(prev => prev.map(e =>
      e.id !== escrowId ? e : {
        ...e,
        milestones: e.milestones.map(m =>
          m.id !== milestoneId ? m : { ...m, ...patch }
        )
      }
    ))
  }

  // ── lockFunds — calls EscrowContract.lock_funds on Soroban ──────────────
  const lockFunds = useCallback(async (formData) => {
    setLoading(true)
    // Soroban call: EscrowContract.lock_funds(creator, total, milestones[])
    const { txHash } = await sorobanInvoke(CONTRACTS.escrow, "lock_funds", {
      creator:    formData.creatorAddress,
      amount_xlm: formData.totalBudget,
      milestones: formData.milestones,
    }, 1200)

    const newEscrow = {
      id:                generateId("ESC"),
      title:             formData.title,
      client:            "GBXLK7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQ",
      creator:           formData.creatorAddress || "GUNKNOWN",
      totalAmount:       formData.totalBudget,
      currency:          "XLM",
      status:            "active",
      workTokenDiscount: 10,
      sorobanTxHash:     txHash,
      network:           STELLAR_NETWORK.name,
      createdAt:         new Date().toISOString().slice(0,10),
      milestones:        formData.milestones.map((m, i) => ({
        id: "M" + (i+1), title: m.title,
        amount: m.amount, status: "pending",
        submittedAt: null, approvedAt: null
      }))
    }
    setEscrows(prev => [newEscrow, ...prev])
    pushEvent("FundsLocked", newEscrow.id, { amount: formData.totalBudget, txHash })
    pushNotif("funds-locked", `Funds locked for "${formData.title}"`, newEscrow.id)
    setLoading(false)
    return newEscrow
  }, [])

  // ── submitMilestone — calls EscrowContract.submit_milestone ──────────────
  const submitMilestone = useCallback(async (escrowId, milestoneId) => {
    setLoading(true)
    await sorobanInvoke(CONTRACTS.escrow, "submit_milestone", { escrowId, milestoneId }, 800)
    updateMilestone(escrowId, milestoneId, {
      status: "submitted", submittedAt: new Date().toISOString().slice(0,10)
    })
    pushEvent("WorkSubmitted", escrowId, { milestone: milestoneId })
    pushNotif("milestone-submitted", "Work submitted — awaiting client approval", escrowId)
    setLoading(false)
  }, [])

  // ── approveMilestone — inter-contract call: Escrow → PlatformUtility ─────
  const approveMilestone = useCallback(async (escrowId, milestoneId) => {
    setLoading(true)
    // Step 1: EscrowContract.approve_milestone (which internally calls PlatformUtility)
    await sorobanInvoke(CONTRACTS.escrow, "approve_milestone", { escrowId, milestoneId }, 600)
    // Step 2: Simulate inter-contract call to PlatformUtilityContract.check_discount
    const discount = await checkDiscount("GBXLK7BZNXJ7LKUMQMQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQZ2FQZPJQ")

    updateMilestone(escrowId, milestoneId, {
      status: "approved", approvedAt: new Date().toISOString().slice(0,10)
    })
    pushEvent("MilestoneApproved", escrowId, { milestone: milestoneId })
    if (discount > 0) pushEvent("DiscountApplied", escrowId, { discount })
    pushNotif("ready-to-claim",
      "💰 Funds Ready to Claim — milestone approved", escrowId,
      { milestoneId })
    setLoading(false)
  }, [])

  // ── releaseFunds — calls EscrowContract.release_funds ───────────────────
  const releaseFunds = useCallback(async (escrowId, milestoneId) => {
    setLoading(true)
    await sorobanInvoke(CONTRACTS.escrow, "release_funds", { escrowId, milestoneId }, 800)
    updateMilestone(escrowId, milestoneId, { status: "released" })
    setEscrows(prev => prev.map(e => {
      if (e.id !== escrowId) return e
      const allDone = e.milestones
        .map(m => m.id === milestoneId ? { ...m, status:"released" } : m)
        .every(m => m.status === "released")
      return allDone ? { ...e, status:"completed" } : e
    }))
    pushEvent("FundsReleased", escrowId, { milestone: milestoneId })
    pushNotif("funds-released", "XLM released to creator ✓", escrowId)
    setLoading(false)
  }, [])

  function dismissNotif(id) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read:true })))
  }

  return (
    <EscrowContext.Provider value={{
      escrows, events, notifications, loading, activeEscrowId,
      setActiveEscrowId: setActiveId,
      lockFunds, submitMilestone, approveMilestone, releaseFunds,
      dismissNotif, markAllRead
    }}>
      {children}
    </EscrowContext.Provider>
  )
}

export function useEscrow() {
  const ctx = useContext(EscrowContext)
  if (!ctx) throw new Error("useEscrow must be used inside EscrowProvider")
  return ctx
}
