import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App';
import { FaPlus, FaMinus, FaTrash, FaArrowLeft } from 'react-icons/fa';

import data from '../data/db.json'; 

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

   
    const parsePrice = (priceString) => {
        if (typeof priceString === 'number') {
            return priceString; 
        }
        if (typeof priceString === 'string') {
            return parseFloat(priceString.replace('$', ''));
        }
        return 0; 
    };

    const getImageUrl = (item) => {
        let folder = '';
        if (data.menProducts.some(p => p.id === item.id)) {
            folder = '/Mens-image/';
        } else if (data.womenProducts.some(p => p.id === item.id)) {
            folder = '/Women-image/';
        } else if (data.kidsProducts.some(p => p.id === item.id)) {
            folder = '/Kids-image/';
        }

        if (folder) {
            return folder + item.image;
        }
        return 'https://placehold.co/150x150/f8f9fa/343a40?text=Image+Not+Found';
    };

    // --- Calculations ---
    
    const subtotal = cartItems.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0);
    const shippingFee = subtotal > 0 ? 5.00 : 0;
    const totalAmount = subtotal + shippingFee;

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>{`
                /* ... (all your existing styles are fine) ... */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lobster&display=swap');
                body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
                .font-lobster { font-family: 'Lobster', cursive; }
                .brand-gradient { background: linear-gradient(to right, #ec4899, #8b5cf6); }
                .navbar-brand { cursor: pointer; }
                .btn-custom { background: linear-gradient(to right, #ec4899, #8b5cf6); color: white; border: none; }
                .btn-custom:hover { color: white; opacity: 0.9; }
                .summary-card {
                    background-color: #ffffff;
                    border: 1px solid #dee2e6;
                    border-radius: 0.375rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075);
                }
                .cart-item-img {
                    width: 100%;
                    max-width: 100px;
                    height: 100px;
                    object-fit: cover;
                }
            `}</style>

            <div className="bg-light min-vh-100">
                <nav className="navbar navbar-expand-lg navbar-dark brand-gradient shadow-sm py-2 sticky-top">
                    <div className="container">
                        <a className="navbar-brand fs-2 font-lobster" onClick={() => navigate('/')}>FitFusion</a>
                    </div>
                </nav>

                <main className="container my-4 my-md-5">
                    {cartItems.length === 0 ? (
                      
                        <div className="text-center py-5">
                            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="img-fluid" style={{maxWidth: '250px'}}/>
                            <h2 className="display-6 fw-semibold mt-4">Your cart is empty!</h2>
                            <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
                            <button className="btn btn-custom px-5 py-2" onClick={() => navigate('/')}>
                                <FaArrowLeft className="me-2" />
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        
                        <div className="row g-4">
                            <div className="col-lg-8">
                                <h1 className="mb-4">Shopping Cart</h1>
                                {cartItems.map((item) => {
                                    
                                    const itemPrice = parsePrice(item.price);
                                    
                                    return (
                                        <div className="card mb-3 shadow-sm" key={item.id}>
                                            <div className="card-body">
                                                <div className="row align-items-center">
                                                    <div className="col-3 col-md-2">
                                                        <img 
                                                            src={getImageUrl(item)} 
                                                            alt={item.name} 
                                                            className="img-fluid rounded cart-item-img" 
                                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/ccc/343a40?text=Not+Found'; }}
                                                        />
                                                    </div>
                                                    <div className="col-9 col-md-4">
                                                        <h5 className="mb-0 text-truncate">{item.name}</h5>
                                                       
                                                        <p className="text-muted small mb-0">${itemPrice.toFixed(2)}</p>
                                                    </div>
                                                    <div className="col-8 col-md-3 mt-2 mt-md-0 d-flex align-items-center justify-content-start justify-content-md-center">
                                                        <button onClick={() => decreaseQuantity(item.id)} className="btn btn-outline-secondary btn-sm"><FaMinus /></button>
                                                        <span className="mx-3 fw-bold">{item.quantity}</span>
                                                        <button onClick={() => increaseQuantity(item.id)} className="btn btn-outline-secondary btn-sm"><FaPlus /></button>
                                                    </div>
                                                    <div className="col-4 col-md-3 mt-2 mt-md-0 text-end">
                                                       
                                                        <span className="fw-bold me-2">${(itemPrice * item.quantity).toFixed(2)}</span>
                                                        <button onClick={() => removeFromCart(item.id)} className="btn btn-link text-danger p-0"><FaTrash /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* --- Price Summary Card --- */}
                            <div className="col-lg-4">
                                <div className="summary-card p-4 sticky-top" style={{top: '100px'}}>
                                    <h3 className="mb-3">Order Summary</h3>
                                    <div className="d-flex justify-content-between">
                                        <p>Subtotal</p>
                                        <p>${subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p>Shipping</p>
                                        <p>${shippingFee.toFixed(2)}</p>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold h5">
                                        <p>Total</p>
                                        <p>${totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="d-grid mt-3">
                                        <button 
                                            className="btn btn-custom py-2" 
                                            onClick={() => navigate('/address')}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default CartPage;