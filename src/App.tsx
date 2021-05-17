import { createWallet, KinClient, KinTest, Wallet } from '@kin-sdk/client'
import React, { useState } from 'react'

const pfx = '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev'

const txLink = (tx: string) => {
  return `https://explorer.solana.com/tx/${tx}${pfx}`
}
const pkLink = (pk: string) => {
  return `https://explorer.solana.com/address/${pk}${pfx}`
}

function App() {
  const [client] = useState<KinClient>(() => new KinClient(KinTest))
  const [wallet, setWallet] = useState<Wallet>()
  const [created, setCreated] = useState<boolean>()
  const [step1Status, setStep1Status] = useState<string>()
  const [step2Status, setStep2Status] = useState<string>()
  const [step3Status, setStep3Status] = useState<string>()
  const [step4Status, setStep4Status] = useState<string>()
  const [txId, setTxId] = useState<string>()

  const generateKeyPair = () => setWallet(createWallet('create', {}))
  const createAccount = async () => {
    setStep1Status('Creating Account Started')
    try {
      const [result, error] = await client.createAccount(wallet?.secret!)
      if (error) {
        console.log('error', error)
        setStep1Status(error)
      } else {
        setCreated(!!result)
        setStep1Status('Creating Account Done ' + JSON.stringify(result))
      }
    } catch (e) {
      setStep1Status('Something went wrong!' + e)
    }
  }
  const getBalances = async () => {
    setStep2Status('getBalances')
    try {
      const [result, error] = await client.getBalances(wallet?.publicKey!)
      if (error) {
        console.log('error', error)
        setStep2Status(error)
      } else {
        setStep2Status(JSON.stringify(result))
      }
    } catch (e) {
      setStep2Status('Something went wrong!' + e)
    }
  }
  const requestAirdrop = async () => {
    setStep3Status('requestAirdrop')
    try {
      const [result, error] = await client.requestAirdrop(wallet?.publicKey!, '1000')
      if (error) {
        console.log('error', error)
        setStep3Status(error)
      } else {
        await getBalances()
        setStep3Status(JSON.stringify(result))
      }
    } catch (e) {
      setStep3Status('Something went wrong!' + e)
    }
  }

  const submitPayment = async () => {
    setStep4Status('submitPayment')
    setTxId('')
    try {
      const [result, error] = await client.submitPayment({
        secret: wallet?.secret!,
        tokenAccount: wallet?.publicKey!,
        amount: '10',
        destination: 'Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ',
        memo: 'Test Payment',
      })
      if (error) {
        console.log('error', error)
        setStep4Status(error)
      } else {
        await getBalances()
        setStep4Status('Submit Payment Done: ' + result)
        setTxId(result)
      }
    } catch (e) {
      setStep4Status('Something went wrong!' + e)
    }
  }
  return (
    <div className="App">
      {!wallet ? (
        <div>
          <button onClick={generateKeyPair}>Generate Wallet</button>
        </div>
      ) : (
        <div>
          <div>
            <a href={pkLink(wallet.publicKey!)} target="_blank" rel="noreferrer">
              <code>publicKey: {wallet.publicKey}</code>
            </a>
          </div>
          <div>{created ? `Account Created ${created}` : <button onClick={createAccount}>Create Account</button>}</div>
          <pre>{step1Status}</pre>
          {created ? (
            <div>
              <div>
                <button onClick={getBalances}>Get Balances</button>
                <pre>{step2Status}</pre>
              </div>
              <div>
                <button onClick={requestAirdrop}>Request Airdrop</button>
                <pre>{step3Status}</pre>
              </div>
              <div>
                <button onClick={submitPayment}>Submit Payment</button>
                <pre>{step4Status}</pre>
                {txId ? (
                  <a href={txLink(txId)} target="_blank" rel="noreferrer">
                    <code>{txId}</code>
                  </a>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default App
