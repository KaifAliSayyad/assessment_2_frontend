import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './WatchList.css';

export default function WatchList() {
    const [watchlist, setWatchlist] = useState([{
        "id": 1,
        "name": "Product Name",
        "quantity": 100,
        "minPrice": 10.5,
        "maxPrice": 20,
        "currentPrice": 20
    }]);
    const [budget, setBudget] = useState(100000); // Add this line for demo budget
    
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // Renamed from error to errors
    const [buyQuantities, setBuyQuantities] = useState({});
    const [generalError, setGeneralError] = useState(''); // Added for general errors
    
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    useEffect(() => {
        setLoading(false);
        // if(!user){
        //     navigate('/login');
        // }
        // else{
        //     fetchWatchlist();
        // }
    }, [user, navigate]);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/portfolio/${user.id}/watchlist`);
            setWatchlist(response.data);
            setGeneralError('');
        } catch (err) {
            setGeneralError('Failed to fetch watchlist data');
            console.error('Watchlist fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (stockId, value) => {
        const quantity = parseInt(value) || 0;
        const stock = watchlist.find(s => s.id === stockId);
        
        if (quantity > stock.quantity) {
            setErrors(prev => ({
                ...prev,
                [stockId]: `Maximum ${stock.quantity} shares available to buy`
            }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[stockId];
                return newErrors;
            });
        }

        setBuyQuantities(prev => ({
            ...prev,
            [stockId]: quantity
        }));
    };

    const buyApi = async (stock) => {
        const response = await axios.post(`http://localhost:8080/trading/buy/${stock.id}`, {
            user_id : user?.id,
            quantity : buyQuantities[stock.id]
        });
    };

    const handleBuy = (stock) => {
        const buyQuantity = buyQuantities[stock.id] || 0;
        if (buyQuantity <= 0) {
            setErrors(prev => ({
                ...prev,
                [stock.id]: 'Please enter a valid quantity to buy'
            }));
            return;
        }
        if (buyQuantity > stock.quantity) {
            return;
        }
        
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (generalError) {
        return <div className="error-message">{generalError}</div>;
    }

    return (
        <div className="watchlist-container">
            <div className="holdings-header">
                <h1>My WatchList</h1>
                <div className="budget">
                    Budget: ₹{budget.toLocaleString()}
                </div>
            </div>

            {watchlist.length === 0 ? (
                <div className="empty-watchlist">
                    <p>Your watchlist is empty</p>
                </div>
            ) : (
                <div className="watchlist-table-container">
                    <table className="watchlist-table">
                        <thead>
                            <tr>
                                <th>Stock Name</th>
                                <th>Current Price (₹)</th>
                                <th>Min Price (₹)</th>
                                <th>Max Price (₹)</th>
                                <th>Available Quantity</th>
                                <th>Buy Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchlist.map(stock => (
                                <tr key={stock.id}>
                                    <td>{stock.name}</td>
                                    <td>{stock.currentPrice.toFixed(2)}</td>
                                    <td>{stock.minPrice.toFixed(2)}</td>
                                    <td>{stock.maxPrice.toFixed(2)}</td>
                                    <td>{stock.quantity}</td>
                                    <td>
                                        <div className="quantity-input-container">
                                            <input
                                                type="number"
                                                min="1"
                                                max={stock.quantity}
                                                value={buyQuantities[stock.id] || ''}
                                                onChange={(e) => handleQuantityChange(stock.id, e.target.value)}
                                                className="quantity-input"
                                            />
                                            {errors[stock.id] && (
                                                <div className="error-message">{errors[stock.id]}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="buy-button"
                                            onClick={() => handleBuy(stock)}
                                            disabled={!buyQuantities[stock.id] || errors[stock.id]}
                                        >
                                            Buy
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

