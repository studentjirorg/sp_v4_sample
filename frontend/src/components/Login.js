import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        // Login Form with Bootstrap
        <form onSubmit={Login} className="form-signin mx-auto mt-5 p-4 border rounded shadow-sm" style={{maxWidth: "400px"}}>
        {userContext.user ? <Navigate replace to="/" /> : ""}
        
        <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>
        
        <div className="form-floating mb-3">
            <input 
            type="text" 
            className="form-control" 
            id="floatingUsername" 
            placeholder="Username"
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingUsername">Username</label>
        </div>
        
        <div className="form-floating mb-3">
            <input 
            type="password" 
            className="form-control" 
            id="floatingPassword" 
            placeholder="Password"
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </form>
    );
}

export default Login;