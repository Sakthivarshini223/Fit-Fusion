import React, { useContext, useEffect } from 'react';
import { CartContext } from '../App'; 
import { useNavigate } from 'react-router-dom';


const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.replace(/[^0-9.]/g, ''));
};

const Checkout = () => {
    const { buyNowItem, setBuyNowItem } = useContext(CartContext);
    const navigate = useNavigate();

    
    useEffect(() => {
        if (!buyNowItem) {
            console.log("No item to buy, redirecting...");
            navigate('/');
        }
    }, [buyNowItem, navigate]);

   
    useEffect(() => {
        return () => {
            setBuyNowItem(null);
        };
    }, [setBuyNowItem]);


    const getImageUrl = (imageName) => {
        return `Mens-image/${imageName}`; 
    };

    if (!buyNowItem) {
       
        return <p>Redirecting...</p>;
    }

   
    const itemPrice = parsePrice(buyNowItem.price);
    const tax = itemPrice * 0.05; 
    const shipping = 5.00; 
    const total = itemPrice + tax + shipping;

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            
            <div className="container" style={{ marginTop: '80px', maxWidth: '800px' }}>
                <h1 className="text-center mb-4">Complete Your Purchase</h1>
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <h4 className="mb-3">Order Summary</h4>
                        
                        {/* The Single Item */}
                        <div className="d-flex align-items-center mb-3">
                            <img 
                                src={getImageUrl(buyNowItem.image)} 
                                alt={buyNowItem.name} 
                                className="img-fluid rounded" 
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600/3b82f6/ffffff?text=Image+Missing"; }}
                            />
                            <div className="ms-3 flex-grow-1">
                                <h5 className="mb-0">{buyNowItem.name}</h5>
                                <p className="mb-0 text-muted">Quantity: 1</p>
                            </div>
                            <span className="fs-5 fw-bold">{buyNowItem.price}</span>
                        </div>

                        <hr />

                        {/* Order Total */}
                        <div className="d-flex justify-content-between">
                            <p className="text-muted">Subtotal</p>
                            <p>{buyNowItem.price}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="text-muted">Tax (5%)</p>
                            <p>${tax.toFixed(2)}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="text-muted">Shipping</p>
                            <p>${shipping.toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fs-4 fw-bold">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>

                        <div className="d-grid mt-4">
                            <button 
                                className="btn btn-primary btn-lg" 
                                style={{ background: 'linear-gradient(to right, #1f2937, #3b82f6)', border: 'none' }}
                                onClick={() => alert('Payment processing... (not implemented)')}
                            >
                                Pay ${total.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;