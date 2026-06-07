import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from './App';

// Local Images
import mensImg from "./Card-images/Men.jpg";
import womenImg from "./Card-images/women.jpg";
import kidsImg from "./Card-images/Kid.jpg";
import accessoriesImg from "./Card-images/acss.jpg";
import MensJacket from "./Card-images/MensJacket.jpg";
import GoldChain from "./Card-images/pngtree-gold-chain-shiny-metal-accessories.jpg";
import Kid from "./Card-images/t-shirts.jpg";
import KidFrock from "./Card-images/kidFrock.jpg";
import Banner from "./Card-images/banner.jpg";

// Icons
const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
);

const ShoppingCartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

// Categories (UPDATED HERE) 
const categories = [
  { name: "Mens", imageUrl: mensImg, path: "/mens" },
  { name: "Womens", imageUrl: womenImg, path: "/womens" },
  { name: "Kids", imageUrl: kidsImg, path: "/kids" },
  { name: "Accessories", imageUrl: accessoriesImg },
];

// --- Products ---
const products = [
  { id: 1, name: "Halloween T-Shirt", price: "$49.99", image: Kid },
  { id: 2, name: "Brown Leather Jacket", price: "$29.99", image: MensJacket },
  { id: 3, name: "Pink Frock", price: "$59.99", image: KidFrock },
  { id: 4, name: "Gold Mens-Chain", price: "$89.99", image: GoldChain },
];

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  const handleCardClick = (cat) => {
    // This logic now works for Mens, Womens, and Kids
    if (cat.path) navigate(cat.path);
  };

  // Also, update the cart button to navigate
  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
        .font-lobster { font-family: 'Lobster', cursive; }
        .brand-gradient { background: linear-gradient(to right, #ec4899, #8b5cf6); }
        .category-item { transition: background-color 0.2s ease-in-out; }
        .category-item:hover { background-color: #fdf2f8; cursor: pointer; }
        .product-card { transition: transform 0.2s ease-in-out; }
        .product-card:hover { transform: translateY(-5px); }
        .category-img { width: 120px; height: 120px; object-fit: cover; margin: auto; }
        .product-img { width: 100%; height: 250px; object-fit: cover; }
      `}</style>

      <div className="bg-light min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark brand-gradient shadow-sm py-2 sticky-top">
          <div className="container-fluid">
            <a className="navbar-brand fs-2 font-lobster" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>FitFusion</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarContent">
              <form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: "500px", flexGrow: 1 }} onSubmit={handleSearch}>
                <input className="form-control me-2" type="search" placeholder="Search for products..." value={query} onChange={(e) => setQuery(e.target.value)} />
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
                  <button className="btn btn-light d-flex align-items-center" onClick={handleCartClick}> {/* ✅ --- ADDED CLICK HANDLER --- */}
                    <ShoppingCartIcon className="me-1" /> Cart
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Welcome Section */}
        <section className="container-fluid text-center mt-4">
          <h2 className="fw-semibold text-dark">Welcome to FitFusion</h2>
          <p className="text-muted">Your one-stop shop for amazing products. Resize the window to see the layout adapt dynamically!</p>
        </section>

        {/* Categories */}
        <main className="container-fluid my-4">
          <section className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="row text-center row-cols-2 row-cols-md-4 g-4">
              {categories.map((cat) => (
                <div key={cat.name} className="col" onClick={() => handleCardClick(cat)}>
                  <div className="p-3 rounded category-item">
                    <img src={cat.imageUrl} alt={cat.name} className="rounded category-img" />
                    <p className="mb-0 mt-2 fw-semibold text-dark">{cat.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ✅ Hero Banner with Inline Background */}
          <section
            className="p-5 mb-4 rounded-3 shadow-lg hero-banner"
            style={{
              color: "white",
              backgroundImage: `url(${Banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="container-fluid py-5">
              <h1 className="display-5 fw-bold"></h1>
              <p className="col-md-8 fs-4"></p>
              <button className="btn btn-light btn-lg" type="button">Shop New Arrivals</button>
            </div>
          </section>

          {/* Products */}
          <section className="container-fluid">
            <h2 className="mb-4">Trending Products</h2>
            <div className="row row-cols-2 row-cols-md-4 g-4">
              {products.map((product) => (
                <div className="col" key={product.id}>
                  <div className="card h-100 shadow-sm border-0 product-card">
                    <img src={product.image} className="card-img-top product-img" alt={product.name} />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{product.name}</h5>
                      <p className="card-text">{product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white mt-5">
          <div className="container-fluid p-4">
            <div className="row">
              <div className="col-6 col-lg-3 mb-3">
                <h5>Shop</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white text-decoration-none">FitFusion</a></li>
                  <li><a href="#" className="text-white text-decoration-none"></a></li>
                </ul>
              </div>
              <div className="col-6 col-lg-3 mb-3">
                <h5>About</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
                  <li><a href="#" className="text-white text-decoration-none">We are Providing Quality Clothings</a></li>
                </ul>
              </div>
              <div className="col-6 col-lg-3 mb-3">
                <h5>Help</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white text-decoration-none">Contact</a></li>
                  <li><a href="#" className="text-white text-decoration-none">7010361927</a></li>
                </ul>
              </div>
              <div className="col-6 col-lg-3 mb-3">
                <h5>Follow Us</h5>
                <p>fitfusion@gmail.com</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default Home;