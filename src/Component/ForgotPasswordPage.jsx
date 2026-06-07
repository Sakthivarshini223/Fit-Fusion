import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !newPassword) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await response.json();
            
            if (response.ok) {
                setMessage('Password reset successful! You can now log in.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
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
                .reset-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            `}</style>
            
            <div className="reset-container">
                <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <h1 className="font-lobster brand-gradient" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>FitFusion</h1>
                                <p className="text-muted">Reset your password</p>
                            </div>
                            <form onSubmit={handleReset}>
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
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                {error && <p className="text-danger small">{error}</p>}
                                {message && <p className="text-success small">{message}</p>}
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-custom py-2" disabled={loading}>
                                        {loading ? 'Processing...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-muted mb-0">Remembered your password? <Link to="/login">Log In</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
