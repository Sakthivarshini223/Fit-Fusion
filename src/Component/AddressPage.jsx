import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddressPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
       
        console.log("Address submitted! Navigating to payment...");
        
       
        navigate('/payment'); 
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
                                    <h1 className="card-title text-center mb-4">Shipping Address</h1>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="fullName" className="form-label">Full Name</label>
                                            <input type="text" className="form-control" id="fullName" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="city" className="form-label">City</label>
                                            <input type="text" className="form-control" id="city" required />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="state" className="form-label">State</label>
                                                <input type="text" className="form-control" id="state" required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="zip" className="form-label">Zip Code</label>
                                                <input type="text" className="form-control" id="zip" required />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone Number</label>
                                            <input type="tel" className="form-control" id="phone" required />
                                        </div>
                                        <div className="d-grid mt-4">
                                            <button type="submit" className="btn btn-custom py-2">Save and Continue</button>
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

export default AddressPage;