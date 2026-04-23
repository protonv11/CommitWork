import React, { createContext, useContext, useState, useCallback } from "react"
import { MOCK_ESCROWS, MOCK_EVENTS } from "../utils/constants"
import { generateId } from "../utils/helpers"

const EscrowContext = createContext(null)

export function EscrowProvider({ children }) {
  const [escrows, setEscrows]           = useState(MOCK_ESCROWS)
  const [events, setEvents]             = useState(MOCK_EVENTS)
  const [notifications, setNotifs]      = useState([])
  const [activeEscrowId, setActiveId]   = useState(null)
  const [loading, setLoading]           = useState(false)

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

  // Immutably update a milestone inside an escrow
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

  const lockFunds = useCallback(async (formData) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const newEscrow = {
      id: generateId("ESC"),
      title: formData.title,
      client: "0xA1B2C3D4E5F6A1B2",
      creator: formData.creatorAddress || "0xUnknown",
      totalAmount: formData.totalBudget,
      currency: "ETH",
      status: "active",
      workTokenDiscount: 10,
      createdAt: new Date().toISOString().slice(0,10),
      milestones: formData.milestones.map((m, i) => ({
        id: "M" + (i+1), title: m.title,
        amount: m.amount, status: "pending",
        submittedAt: null, approvedAt: null
      }))
    }
    setEscrows(prev => [newEscrow, ...prev])
    pushEvent("FundsLocked", newEscrow.id, { amount: formData.totalBudget })
    pushNotif("funds-locked", `Funds locked for "${formData.title}"`, newEscrow.id)
    setLoading(false)
    return newEscrow
  }, [])

  const submitMilestone = useCallback(async (escrowId, milestoneId) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    updateMilestone(escrowId, milestoneId, {
      status: "submitted", submittedAt: new Date().toISOString().slice(0,10)
    })
    pushEvent("WorkSubmitted", escrowId, { milestone: milestoneId })
    pushNotif("milestone-submitted", "Work submitted — awaiting client approval", escrowId)
    setLoading(false)
  }, [])

  const approveMilestone = useCallback(async (escrowId, milestoneId) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    updateMilestone(escrowId, milestoneId, {
      status: "approved", approvedAt: new Date().toISOString().slice(0,10)
    })
    pushEvent("MilestoneApproved", escrowId, { milestone: milestoneId })
    pushEvent("DiscountApplied",   escrowId)
    pushNotif("ready-to-claim",
      "💰 Funds Ready to Claim — milestone approved", escrowId,
      { milestoneId })
    setLoading(false)
  }, [])

  const releaseFunds = useCallback(async (escrowId, milestoneId) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    updateMilestone(escrowId, milestoneId, { status: "released" })
    // If all milestones released, mark escrow completed
    setEscrows(prev => prev.map(e => {
      if (e.id !== escrowId) return e
      const allDone = e.milestones
        .map(m => m.id === milestoneId ? { ...m, status:"released" } : m)
        .every(m => m.status === "released")
      return allDone ? { ...e, status:"completed" } : e
    }))
    pushEvent("FundsReleased", escrowId, { milestone: milestoneId })
    pushNotif("funds-released", "Funds released to creator ✓", escrowId)
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
