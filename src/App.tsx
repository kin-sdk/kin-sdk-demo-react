import { KinClient, KinProd, Wallet } from '@kin-sdk/client'
import React, { useState } from 'react'

function App() {
  const [client] = useState<KinClient>(() => new KinClient(KinProd))
  const [wallet, setWallet] = useState<Wallet>()
  const [created, setCreated] = useState<boolean>()
  const [step1Status, setStep1Status] = useState<string>()
  const [step2Status, setStep2Status] = useState<string>()
  const [step3Status, setStep3Status] = useState<string>()

  const generateKeyPair = () => setWallet(KinClient.createWallet('create', {}))
  const createAccount = async () => {
    setStep1Status('Creating Account Started')
    const [result, error] = await client.createAccount(wallet?.secret!)
    if (error) {
      console.log('error', error)
      setStep1Status(error)
    } else {
      setCreated(!!result)
      setStep1Status('Creating Account Done ' + !!result)
    }
  }
  const resolveTokenAccount = async () => {
    setStep2Status('resolveTokenAccount')
    const [result, error] = await client.resolveTokenAccounts(wallet?.publicKey!)
    if (error) {
      console.log('error', error)
      setStep2Status(error)
    } else {
      setStep2Status(JSON.stringify(result))
    }
  }
  const submitPayment = async () => {
    setStep3Status('submitPayment')
    const [result, error] = await client.submitPayment({
      secret: wallet?.secret!,
      tokenAccount: wallet?.publicKey!,
      amount: '1',
      destination: 'Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ',
      memo: 'Test Payment',
    })
    if (error) {
      console.log('error', error)
      setStep3Status(error)
    } else {
      setStep3Status('Creating Account Done ' + !!result)
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
            <code>publicKey: {wallet.publicKey}</code>
          </div>
          <div>{created ? `Account Created ${created}` : <button onClick={createAccount}>Create Account</button>}</div>
          <pre>{step1Status}</pre>
          {created ? (
            <div>
              <div>
                <button onClick={resolveTokenAccount}>Resolve Token Account</button>
                <pre>{step2Status}</pre>
              </div>
              <div>
                <button onClick={submitPayment}>Submit Payment</button>
                <pre>{step3Status}</pre>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default App
