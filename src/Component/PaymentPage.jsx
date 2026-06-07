import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useContext(CartContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        if (cartItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems, totalPrice })
            });

            if (res.ok) {
                alert("Payment successful! Thank you for your order.");
                setCartItems([]); // Empty the cart
                navigate('/');
            } else {
                setError('Failed to process the order.');
            }
        } catch (err) {
            console.error(err);
            setError('Server error during payment.');
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
            `}</style>

            <div className="bg-light min-vh-100">
                <nav className="navbar navbar-dark brand-gradient shadow-sm py-2">
                    <div className="container">
                        <a className="navbar-brand fs-2 font-lobster" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>FitFusion</a>
                    </div>
                </nav>

                <main className="container my-4 my-md-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h1 className="card-title text-center mb-4">Payment Details</h1>
                                    <form onSubmit={handlePayment}>
                                        <div className="mb-3">
                                            <label htmlFor="cardName" className="form-label">Name on Card</label>
                                            <input type="text" className="form-control" id="cardName" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                            <input type="text" className="form-control" id="cardNumber" placeholder="1111-2222-3333-4444" required />
                                        </div >
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                                                <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="cvv" className="form-label">CVV</label>
                                                <input type="text" className="form-control" id="cvv" placeholder="123" required />
                                            </div>
                                        </div>
                                        {error && <p className="text-danger small">{error}</p>}
                                        <div className="d-grid mt-4">
                                            <button type="submit" className="btn btn-custom py-2" disabled={loading}>
                                                {loading ? 'Processing...' : 'Pay Now'}
                                            </button>
                                        </div>
                                    </form >
                                </div >
                            </div >
                        </div >
                    </div >
                </main >
            </div >
        </>
    );
};

export default PaymentPage;