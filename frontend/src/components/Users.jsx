import { useEffect, useState } from "react"
import Button from "./Buttons"
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export default function Users() {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");

    // TODO -> Add debouncing here.
    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://paytm-wallet-clone-app.onrender.com/api/v1/user/bulk?filter=${filter}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                setUsers(response.data.user)
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchUsers();
    }, [filter]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={e => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

// TODO -> push only five users at a time by default add pagination.
function User({user}) {
    const navigate = useNavigate()
    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={() => {
                navigate('/send?id=' + user._id + "&name=" + user.firstName)
            }} label={"Send Money"} />
        </div>
    </div>
}