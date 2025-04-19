import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [wrongInfo, setWrongInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email == "florent@asaasin.ai" && password == "Festi3241") {
      navigate("/dashboard");
      setIsAuthenticated(true);
    } else {
      setWrongInfo(true);
    }
  };

  const name = "Privacy Policy Vet";

  return (
    <>
      <div className="fixed left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 pb-20">
        <h1 className="mb-4 font-bold">{name}</h1>
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm w-96 mx-auto">
          <h2 className="text-lg font-semibold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 p-2 w-full border rounded-lg text-gray-700 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="mt-1 p-2 w-full border rounded-lg text-gray-700 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {wrongInfo && <div className="text-red-800 pb-1 mb-1 rounded">Email or Password provided is incorrect!</div>}
            <button type="submit" className="w-full btn-primary text-white p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
