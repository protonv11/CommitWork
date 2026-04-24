import {
  Horizon,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Asset,
  Memo,
} from "@stellar/stellar-sdk"
import { signTransaction } from "@stellar/freighter-api"
import { STELLAR_NETWORK } from "./constants"

// The platform's escrow holding account on Testnet.
export const ESCROW_HOLDING_ACCOUNT =
  "GBHCRG5VDX5GMZZ474SQVZB7N5MULB6A3PCCH6OOYQCLA5EFIZ7WQLOB"

const server = new Horizon.Server(STELLAR_NETWORK.horizon)

/**
 * Build, sign (via Freighter), and submit a real XLM payment
 * to the platform escrow holding account.
 *
 * @param {string} senderAddress - Connected wallet's public key
 * @param {string|number} amountXlm - Amount in XLM (e.g. "100")
 * @param {string} memo - Short memo identifying the escrow
 * @returns {Promise<string>} Transaction hash on success
 */
export async function lockFundsOnChain(senderAddress, amountXlm, memo) {
  // 1. Load sender account (sequence number etc.)
  const account = await server.loadAccount(senderAddress)

  // Prevent sending to self (no balance change)
  if (ESCROW_HOLDING_ACCOUNT === senderAddress) {
    throw new Error('Escrow holding account cannot be the same as the sender address')
  }

  // 2. Ensure escrow holding account exists and has sufficient balance (Testnet only)
  try {
    const destAccount = await server.loadAccount(ESCROW_HOLDING_ACCOUNT)
    const nativeBal = destAccount.balances.find(b => b.asset_type === 'native')
    if (parseFloat(nativeBal?.balance || '0') < 1) {
      // Fund via Friendbot if balance is low
      await fetch(`https://friendbot.stellar.org?addr=${ESCROW_HOLDING_ACCOUNT}`)
      console.info('[stellarTx] Funded escrow holding account via Friendbot')
    }
  } catch (e) {
    // Account likely does not exist – create/fund via Friendbot
    await fetch(`https://friendbot.stellar.org?addr=${ESCROW_HOLDING_ACCOUNT}`)
    console.info('[stellarTx] Created escrow holding account via Friendbot')
  }

  // 3. Build transaction
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: ESCROW_HOLDING_ACCOUNT,
        asset: Asset.native(),
        amount: String(parseFloat(amountXlm).toFixed(7)),
      })
    )
    .addMemo(Memo.text(memo.slice(0, 28))) // Stellar memo max 28 bytes
    .setTimeout(180)
    .build()

  // 4. Get XDR for signing
  const txXdr = tx.toXDR()

  // 5. Request Freighter signature
  const signResult = await signTransaction(txXdr, { networkPassphrase: Networks.TESTNET })

  if (signResult.error) {
    throw new Error('Freighter signing failed: ' + signResult.error)
  }

  // 6. Submit signed transaction
  const { TransactionBuilder: TB } = await import('@stellar/stellar-sdk')
  const signedTx = TB.fromXDR(signResult.signedTxXdr, Networks.TESTNET)
  try {
    const result = await server.submitTransaction(signedTx)
    console.info('[stellarTx] Transaction submitted, hash:', result.hash)
    return result.hash
  } catch (submitErr) {
    console.error('[stellarTx] Submission error:', submitErr)
    // Horizon returns error with result_xdr, we surface the message
    const errMsg = submitErr?.response?.data?.extras?.result_codes?.operations?.[0] || submitErr.message
    throw new Error('Transaction submission failed: ' + errMsg)
  }
}
