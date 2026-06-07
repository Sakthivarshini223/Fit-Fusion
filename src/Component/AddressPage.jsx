import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddressPage = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newLine, setNewLine] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newZip, setNewZip] = useState('');
    const [newName, setNewName] = useState('');
    const [newDoor, setNewDoor] = useState('');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/addresses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setError('');
        if (!newName || !newDoor || !newLine || !newCity || !newZip) {
            setError('Please fill out all fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: newName,
                    door_number: newDoor,
                    address_line: newLine,
                    city: newCity,
                    zip: newZip
                })
            });

            if (res.ok) {
                setNewName(''); setNewDoor(''); setNewLine(''); setNewCity(''); setNewZip('');
                fetchAddresses(); // Refresh the list
            } else {
                setError('Failed to add address');
            }
        } catch (err) {
            console.error(err);
            setError('Server error.');
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/addresses/${addressId}/default`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchAddresses();
            }
        } catch (err) {
            console.error('Error setting default:', err);
        }
    };

    const proceedToPayment = () => {
        const hasDefault = addresses.some(a => a.is_default);
        if (!hasDefault && addresses.length > 0) {
            alert('Please select a default delivery address.');
            return;
        } else if (addresses.length === 0) {
            alert('Please add a delivery address.');
            return;
        }
        navigate('/payment');
    };

    return (
        <div className="bg-light min-vh-100 pb-5">
            <nav className="navbar navbar-dark brand-gradient shadow-sm py-2 mb-4">
                <div className="container">
                    <a className="navbar-brand fs-2 font-lobster" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>FitFusion</a>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">Delivery Addresses</h2>
                
                {loading ? (
                    <p className="text-center">Loading your addresses...</p>
                ) : (
                    <div className="mb-5">
                        {addresses.length === 0 ? (
                            <div className="alert alert-info">You don't have any addresses yet. Add one below!</div>
                        ) : (
                            <ul className="list-group shadow-sm">
                                {addresses.map(addr => (
                                    <li key={addr.id} className={`list-group-item d-flex justify-content-between align-items-center ${addr.is_default ? 'bg-light border-primary' : ''}`}>
                                        <div>
                                            <strong className="d-block text-dark">{addr.full_name}</strong>
                                            <span className="text-muted d-block">{addr.door_number}, {addr.address_line}</span>
                                            <small className="text-muted">{addr.city}, {addr.zip}</small>
                                            {addr.is_default && <span className="badge bg-primary ms-2">Default</span>}
                                        </div>
                                        {!addr.is_default && (
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleSetDefault(addr.id)}>
                                                Set Default
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="card shadow-sm mb-4 border-0">
                    <div className="card-body">
                        <h5 className="card-title mb-3 fw-bold">Add a New Address</h5>
                        <form onSubmit={handleAddAddress}>
                            <div className="mb-2">
                                <input type="text" className="form-control" placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                            </div>
                            <div className="row mb-2">
                                <div className="col-4">
                                    <input type="text" className="form-control" placeholder="Door No." value={newDoor} onChange={(e) => setNewDoor(e.target.value)} required />
                                </div>
                                <div className="col-8">
                                    <input type="text" className="form-control" placeholder="Street / Area Address" value={newLine} onChange={(e) => setNewLine(e.target.value)} required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Zip Code" value={newZip} onChange={(e) => setNewZip(e.target.value)} required />
                                </div>
                            </div>
                            {error && <p className="text-danger small">{error}</p>}
                            <button type="submit" className="btn btn-custom w-100 py-2 fw-bold">Save Address</button>
                        </form>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary px-4" onClick={() => navigate('/cart')}>Back to Cart</button>
                    <button className="btn btn-custom px-5" onClick={proceedToPayment}>Proceed to Payment</button>
                </div>
            </div>
        </div>
    );
};

export default AddressPage;