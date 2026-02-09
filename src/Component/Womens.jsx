import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../data/db.json';
import { CartContext } from '../App'; 


const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
);
const ShoppingCartIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
);

const Women = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    
    const { cartItems, addToCart } = useContext(CartContext);

   
    const getImageUrl = (imageName) => {
        
        return `/Women-image/${imageName}`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", query);
    };

    const handleBrandClick = () => {
        navigate('/');
    };

    const handleBuyNow = (product) => {
        console.log(`Buying ${product.name} now.`);
    };

    const handleTrial = (product) => {
    navigate(`/try-on/women/${product.id}`);
    };

    
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lobster&display=swap');
                body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
                .font-lobster { font-family: 'Lobster', cursive; }
                .brand-gradient { background: linear-gradient(to right, #ec4899, #8b5cf6); }
                .product-card { transition: transform 0.2s ease-in-out; display: flex; flex-direction: column; }
                .product-card:hover { transform: translateY(-5px); }
                .navbar-brand { cursor: pointer; }
                .card-body { flex-grow: 1; }
                .btn { transition: all 0.2s ease-in-out; }
                .btn-custom { background: linear-gradient(to right, #ec4899, #8b5cf6); color: white; border: none; }
                .btn-custom:hover { color: white; opacity: 0.9; }
                .btn-buy { background-color: #8b5cf6; color: white; border-color: #8b5cf6; }
                .btn-buy:hover { background-color: #7c3aed; border-color: #7c3aed; color: white; }
                .btn-trial { background-color: transparent; color: #ec4899; border-color: #ec4899; }
                .btn-trial:hover { background-color: #ec4899; color: white; }
                .cart-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    padding: 5px 8px;
                    border-radius: 50%;
                    background-color: red;
                    color: white;
                    font-size: 0.75rem;
                }
            `}</style>

            <div className="bg-light min-vh-100">
                <nav className="navbar navbar-expand-lg navbar-dark brand-gradient shadow-sm py-2 sticky-top">
                    <div className="container">
                        <a className="navbar-brand fs-2 font-lobster" onClick={handleBrandClick}>FitFusion</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarContent">
                            <form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: "500px", flexGrow: 1 }} onSubmit={handleSearch}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search for products..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button className="btn btn-light" type="submit"><SearchIcon /></button>
                            </form>
                            <ul className="navbar-nav ms-auto align-items-center">
                                <li className="nav-item">
                                    <button className="btn btn-outline-light me-2">Login</button>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-light d-flex align-items-center position-relative" onClick={() => navigate('/cart')}>
                                        <ShoppingCartIcon className="me-1" /> Cart
                                        {cartItemCount > 0 && (
                                            <span className="cart-badge">{cartItemCount}</span>
                                        )}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <main className="container-fluid my-4 px-md-5">
                    <section>
                        <h1 className="mb-4 text-center">Women's Collection</h1>
                        <div className="row row-cols-2 row-cols-md-4 g-4">
                            {data.womenProducts.map((product) => (
                                <div className="col" key={product.id}>
                                    <div className="card h-100 shadow-sm border-0 product-card">
                                        <img src={getImageUrl(product.image)} className="card-img-top" alt={product.name} 
                                           onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = "https://placehold.co/600x600/ec4899/ffffff?text=Image+Missing"; 
                                            }}
                                        />
                                        <div className="card-body pb-0">
                                            <h5 className="card-title text-truncate">{product.name}</h5>
                                            <p className="card-text fw-bold">{product.price}</p>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-0 pt-2 pb-3">
                                            <div className="d-grid gap-2">
                                                {/* 2. Call the addToCart function from the context */}
                                                <button className="btn btn-custom btn-sm" onClick={() => addToCart(product)}>Add to Cart</button>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-buy btn-sm w-100" onClick={() => handleBuyNow(product)}>Buy Now</button>
                                                    <button className="btn btn-trial btn-sm w-100" onClick={() => handleTrial(product)}>Trial</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="bg-dark text-white mt-5 py-4">
                    <div className="container text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} FitFusion. All rights reserved.</p>
                        <small>Designed for responsiveness and modern standards.</small>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Women;