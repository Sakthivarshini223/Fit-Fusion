import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext, AuthContext } from '../App';

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
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
    </svg>
);

const Women = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, addToCart, setCartItems } = useContext(CartContext);
    const { isAuthenticated, logout } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/products?category=women');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imageName) => {
        if (imageName && imageName.startsWith('http')) return imageName;
        return `/Womens-image/${imageName}`;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            fetchProducts();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/products/search?q=${query}`);
            let data = await response.json();
            data = data.filter(p => p.category === 'women');
            setProducts(data);
        } catch (error) {
            console.error('Failed to search products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBrandClick = () => navigate('/');
    
    const handleBuyNow = (product) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        let cleanPrice = typeof product.price === 'string' ? Number(product.price.replace(/[^0-9.-]+/g, "")) : product.price;
        setCartItems([{ ...product, price: cleanPrice, quantity: 1 }]);
        navigate('/address');
    };

    const handleTrial = (product) => navigate(`/try-on/women/${product.id}`);
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
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
                                    placeholder="Search for women's products..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button className="btn btn-light" type="submit"><SearchIcon /></button>
                            </form>
                            <ul className="navbar-nav ms-auto align-items-center">
                                <li className="nav-item">
                                    {isAuthenticated ? (
                                        <button className="btn btn-outline-light me-2" onClick={() => logout()}>Logout</button>
                                    ) : (
                                        <button className="btn btn-outline-light me-2" onClick={() => navigate('/login')}>Login</button>
                                    )}
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-light d-flex align-items-center position-relative" onClick={() => navigate('/cart')}>
                                        <ShoppingCartIcon className="me-1" /> Cart
                                        {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
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
                            {loading && <div className="text-center w-100 py-5"><p>Loading products...</p></div>}
                            {!loading && products.length === 0 && <div className="text-center w-100 py-5"><p>No products found.</p></div>}
                            {!loading && products.map((product) => {
                                const isItemInCart = cartItems.some(item => item.id === product.id);
                                return (
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
                                                    {isItemInCart ? (
                                                        <button className="btn btn-success btn-sm" disabled>
                                                            <CheckIcon /> Added to Cart
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-custom btn-sm" onClick={() => addToCart(product)}>
                                                            Add to Cart
                                                        </button>
                                                    )}
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-buy btn-sm w-100" onClick={() => handleBuyNow(product)}>Buy Now</button>
                                                        <button className="btn btn-trial btn-sm w-100" onClick={() => handleTrial(product)}>Trial</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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