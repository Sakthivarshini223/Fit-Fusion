// src/Component/LoginPage.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App'; // We created this context in App.jsx

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

   const handleLogin = (e) => {
    e.preventDefault();
    
   
    if (email === "user@example.com" && password === "password") {
        login(); 
        navigate('/'); 
    } else {
        setError('Invalid email or password');
    }
};

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lobster&display=swap');
                body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
                .font-lobster { font-family: 'Lobster', cursive; }
                .brand-gradient { background: linear-gradient(to right, #ec4899, #8b5cf6); }
                .btn-custom { background: linear-gradient(to right, #ec4899, #8b5cf6); color: white; border: none; }
                .btn-custom:hover { color: white; opacity: 0.9; }
                .login-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
            `}</style>
            
            <div className="login-container">
                <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <h1 className="font-lobster brand-gradient" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>FitFusion</h1>
                                <p className="text-muted">Please log in to continue</p>
                            </div>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                {error && <p className="text-danger small">{error}</p>}
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-custom py-2">Login</button>
                                </div>
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-muted mb-0">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;