import Button from "../components/Buttons";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import BottomWarning from "../components/BottomWarning";
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function Signin() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleSignIn = async () => {
      try {
          const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
              username,
              password
          });

          localStorage.setItem("token", response.data.token);
          navigate('/dashboard');
      } catch (error) {
          if (error.response) {
              console.log("Response status code:", error.response.status);
              if (error.response.status === 401) {
                  setError("Incorrect username or password.");
              } else {
                  setError("An unexpected error occurred. Please try again later.");
              }
          } else if (error.request) {
              console.error("No response received:", error.request);
              setError("No response received from the server. Please try again later.");
          } else {
              console.error("Error:", error.message);
              setError("An unexpected error occurred. Please try again later.");
          }
      }
  };

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={e => {
          setUsername(e.target.value)
        }} placeholder="vikash@gmail.com" label={"Email"} />
        <InputBox onChange={e => {
          setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={handleSignIn} label={"Sign in"} />
        </div>
        {error && <p>{error}</p>}
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}