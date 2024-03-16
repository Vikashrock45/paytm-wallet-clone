import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import Users from "../components/Users";

export default function Dashboard() {
    return <div className="p-6">
        <div className="pb-2">
            <Appbar />
        </div>
        <div className="px-4">
            <Balance />
        </div>
        <div className="px-4">
            <Users />
        </div>
    </div>
}