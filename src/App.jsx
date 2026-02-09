

import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';


import Home from "./Home";
import Women from './Component/Womens';
import Mens from './Component/Mens';
import Kids from './Component/Kids'; 
import CartPage from './Component/CartPage';
import AddressPage from './Component/AddressPage';
import PaymentPage from './Component/PaymentPage';
import TryOnPage from './Component/TryOnPage';


export const CartContext = createContext();
export const AuthContext = createContext();


const AppLayout = () => {
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
        
        const cleanPrice = Number(String(product.price).replace(/[^0-9.-]+/g, ""));
        
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

    const cartContextValue = { cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity };

    return (
        <CartContext.Provider value={cartContextValue}>
            <Outlet />
        </CartContext.Provider>
    );
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/womens" element={<Women />} />
                        <Route path="/mens" element={<Mens />} />
                        <Route path="/kids" element={<Kids />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/address" element={<AddressPage />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/try-on/:category/:productId" element={<TryOnPage />} />
                    </Route>
                    
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;