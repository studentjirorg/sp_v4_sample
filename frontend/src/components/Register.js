import { useState } from 'react';

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);

    async function Register(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            window.location.href="/";
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    return(
        // Registration Form with Bootstrap
        <form onSubmit={Register} className="form-signup mx-auto mt-5 p-4 border rounded shadow-sm" style={{maxWidth: "400px"}}>
        <h1 className="h3 mb-3 fw-normal text-center">Create an account</h1>
        
        <div className="form-floating mb-3">
            <input 
            type="email" 
            className="form-control" 
            id="floatingEmail" 
            placeholder="Email"
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingEmail">Email address</label>
        </div>
        
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
        
        <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
        </form>
    );
}

export default Register;