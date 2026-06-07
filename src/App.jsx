import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';

import Home from "./Home";
import Women from './Component/Womens';
import Mens from './Component/Mens';
import Kids from './Component/Kids'; 
import CartPage from './Component/CartPage';
import AddressPage from './Component/AddressPage';
import PaymentPage from './Component/PaymentPage';
import TryOnPage from './Component/TryOnPage';
import LoginPage from './Component/LoginPage';
import SignUpPage from './Component/SignUpPage';
import ForgotPasswordPage from './Component/ForgotPasswordPage';
import AdminDashboard from './Component/AdminDashboard'; // New Admin Dashboard

export const CartContext = createContext();
export const AuthContext = createContext();

const AppLayout = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) { return []; }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        let cleanPrice = typeof product.price === 'string' ? Number(product.price.replace(/[^0-9.-]+/g, "")) : product.price;
        const productToAdd = { ...product, price: cleanPrice };
       
        const existingItem = cartItems.find((item) => item.id === productToAdd.id);

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === productToAdd.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => setCartItems(cartItems.filter((item) => item.id !== productId));
    
    const increaseQuantity = (productId) => setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));

    const decreaseQuantity = (productId) => setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    ).filter(item => item.quantity > 0));

    const cartContextValue = { cartItems, setCartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity };

    return (
        <CartContext.Provider value={cartContextValue}>
            <Outlet />
        </CartContext.Provider>
    );
};

// Protect Routes specifically for Admin
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    // Quick role check based on standard FitFusion admin email for now
    if (user?.email !== 'admin@fitfusion.com') {
        return <Navigate to="/" />;
    }
    return children;
};

// Protect Routes for Users
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} />;
    return children;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Initial Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Admin specific route completely separate from normal layout */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />

                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/womens" element={<Women />} />
                        <Route path="/mens" element={<Mens />} />
                        <Route path="/kids" element={<Kids />} />

                        {/* Protected User Routes */}
                        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
                        <Route path="/address" element={<PrivateRoute><AddressPage /></PrivateRoute>} />
                        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                        <Route path="/try-on/:category/:productId" element={<PrivateRoute><TryOnPage /></PrivateRoute>} />
                    </Route>
                    
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;