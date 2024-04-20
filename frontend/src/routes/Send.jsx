import { useSearchParams } from "react-router-dom"
import axios from 'axios'
import { useRef, useState } from "react"

export default function Send() {
    const [sendParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("")
    const toUserName = sendParams.get('name')
    const toUserId = sendParams.get('id')
    const amountRef = useRef(null);
    
    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-2xl text-white">{toUserName[0].toUpperCase()}</span>
                    </div>
                    <h3 className="text-2xl font-semibold">{toUserName}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="amount">
                        Amount (in Rs)
                    </label>
                    <input
                        ref={amountRef}
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="amount"
                        placeholder="Enter amount"
                    />
                    </div>
                    <button onClick={async () => {
                        try {
                        const token = localStorage.getItem("token");
                        await axios.post('https://paytm-wallet-clone-app.onrender.com/api/v1/account/transfer', 
                        {
                            amount: amountRef.current.value,
                            to: toUserId
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        setMessage("Transaction Successful")
                        setLoading(false);
                    } catch (error) {
                        setError(error.message);
                        setLoading(false);
                        setMessage("Transaction Failed")
                    }
                    }} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                        Initiate Transfer
                    </button>
                    {message && <p>{message}</p>} 
                    {error && <p>Error: {error}</p>}
                </div>
                </div>
        </div>
      </div>
    </div>
}