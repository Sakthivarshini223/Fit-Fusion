import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, salesData: [] });
    const [loading, setLoading] = useState(true);
    
    // New Product State
    const [prodName, setProdName] = useState('');
    const [prodPrice, setProdPrice] = useState('');
    const [prodImage, setProdImage] = useState('');
    const [prodCategory, setProdCategory] = useState('men');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else if (res.status === 403 || res.status === 401) {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const token = localStorage.getItem('token');
            const formattedPrice = prodPrice.startsWith('$') ? prodPrice : `$${parseFloat(prodPrice).toFixed(2)}`;

            const res = await fetch('http://localhost:5000/api/admin/products', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: prodName,
                    price: formattedPrice,
                    image: prodImage || 'https://placehold.co/600x600/cccccc/000000?text=No+Image',
                    category: prodCategory
                })
            });

            if (res.ok) {
                setSuccessMsg('Product successfully added to the database!');
                setProdName(''); setProdPrice(''); setProdImage('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Chart Configuration
    const chartData = {
        labels: stats.salesData.map(s => new Date(s.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Daily Revenue ($)',
                data: stats.salesData.map(s => Number(s.dailyRevenue)),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Performance Over Time' }
        }
    };

    return (
        <div className="bg-light min-vh-100 pb-5">
            <nav className="navbar navbar-dark bg-dark shadow-sm py-3 mb-4">
                <div className="container">
                    <span className="navbar-brand mb-0 h1 fs-3">FitFusion <span className="text-warning">Admin</span></span>
                    <button className="btn btn-outline-light" onClick={() => navigate('/')}>Exit to Store</button>
                </div>
            </nav>

            <div className="container">
                {loading ? (
                    <div className="text-center py-5">Loading Dashboard...</div>
                ) : (
                    <>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="card shadow-sm border-0 bg-primary text-white h-100">
                                    <div className="card-body text-center py-5">
                                        <h5 className="card-title text-uppercase mb-3">Total Lifetime Revenue</h5>
                                        <h1 className="display-4 fw-bold">${Number(stats.totalRevenue).toFixed(2)}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card shadow-sm border-0 bg-success text-white h-100">
                                    <div className="card-body text-center py-5">
                                        <h5 className="card-title text-uppercase mb-3">Total Orders Placed</h5>
                                        <h1 className="display-4 fw-bold">{stats.totalOrders}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-12">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body">
                                        {stats.salesData.length > 0 ? (
                                            <Line options={chartOptions} data={chartData} />
                                        ) : (
                                            <div className="text-center text-muted py-5">Not enough sales data yet.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <div className="card shadow-sm border-0">
                                    <div className="card-header bg-dark text-white py-3">
                                        <h5 className="mb-0">Create New Product</h5>
                                    </div>
                                    <div className="card-body p-4">
                                        {successMsg && <div className="alert alert-success">{successMsg}</div>}
                                        <form onSubmit={handleAddProduct}>
                                            <div className="mb-3">
                                                <label className="form-label">Product Name</label>
                                                <input type="text" className="form-control" value={prodName} onChange={e => setProdName(e.target.value)} required />
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Price (USD)</label>
                                                    <input type="number" step="0.01" className="form-control" value={prodPrice} onChange={e => setProdPrice(e.target.value)} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Category</label>
                                                    <select className="form-select" value={prodCategory} onChange={e => setProdCategory(e.target.value)}>
                                                        <option value="men">Men</option>
                                                        <option value="women">Women</option>
                                                        <option value="kids">Kids</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label">Image URL (Optional)</label>
                                                <input type="url" className="form-control" value={prodImage} onChange={e => setProdImage(e.target.value)} placeholder="https://..." />
                                                <div className="form-text">Leave blank to use a default placeholder.</div>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 py-2">Add Product to Store</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
