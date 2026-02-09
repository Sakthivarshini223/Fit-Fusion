

import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();

    const handlePayment = (e) => {
        e.preventDefault();
  
        console.log("Processing payment...");
        alert("Payment successful! Thank you for your order.");
       
        navigate('/'); 
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
                        <a className="navbar-brand fs-2 font-lobster" onClick={() => navigate('/')}>FitFusion</a>
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
                                        </div>
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
                                        <div className="d-grid mt-4">
                                            <button type="submit" className="btn btn-custom py-2">Pay Now</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default PaymentPage;