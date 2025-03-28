import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './WatchList.css';
import DashBar from '../../Components/DashBar';
import buyStock from '../../BuyStock';

export default function WatchList() {
    const [watchlist, setWatchlist] = useState([]);
    const [budget, setBudget] = useState(100000); 
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [currentValue, setCurrentValue] = useState(0);
    
    const [errors, setErrors] = useState({}); // Renamed from error to errors
    const [buyQuantities, setBuyQuantities] = useState({});
    
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    const onLoading = () => {
        if (!user) {
            navigate('/login');
        } else {
            const fetchBudget = async () => {
                try {
                    const response = await axios.get(`http://localhost:9999/register/balance/${user?.id}`);
                    setBudget(response.data);
                } catch (error) {
                    console.error('Error fetching budget:', error);
                }
            };
            const fetchWatchlist = async () => {
                try {
                    const response = await axios.get(`http://localhost:9999/portfolio/${user.id}/watchlist`);
                    setWatchlist(response.data);
                } catch (err) {
                    console.error('Watchlist fetch error:', err);
                } 
            };
            const calculateCurrentValue = async () => {
                try{
                    const res = await axios.get("http://localhost:9999/portfolio/"+user.id+"/value");
                    setCurrentValue(res.data);
                }
                catch(e){
                    console.log(e);
                }
            };
            const calculateTotalInvestment = async () => {
                try{
                    const res = await axios.get("http://localhost:9999/portfolio/"+user.id+"/investment");
                    setTotalInvestment(res.data);
                }
                catch(e){
                    console.log(e);
                }
            };
            fetchBudget();
            fetchWatchlist();
            calculateTotalInvestment();
            calculateCurrentValue();
        }
    };

    useEffect(() => {
        onLoading();
    }, [user, navigate, watchlist]);

    const handleQuantityChange = (stockId, value) => {
        const quantity = parseInt(value) || 0;
        const stock = watchlist.find(s => s.id === stockId);
        
        if (quantity > stock.quantity) {
            setErrors(prev => ({
                ...prev,
                [stockId]: `Maximum ${stock.quantity} shares available to buy`
            }));
        } 
        else if(quantity <= 0) {
            setErrors(prev => ({
                ...prev,
                [stockId]: 'Please enter a valid quantity to buy'
            }));
        }
        else {
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

    const handleRemove = async (stock) => {
        const response = await axios.delete(`http://localhost:9999/portfolio/${user.id}/watchlist/${stock.id}`);
        onLoading();
    };

    const handleBuy = async (stock, quantity, id) => {
        await buyStock(stock, quantity, id);
        onLoading();
    };

    return (
        <div className="watchlist-container">
            <DashBar 
                budget={budget}
                totalInvestment={totalInvestment}
                currentValue={currentValue}
            />
            <div className="holdings-header">
                <h1>My WatchList</h1>
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
                                <th>Available Quantity</th>
                                <th>Buy Quantity</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchlist.map(stock => (
                                <tr key={stock.id}>
                                    <td className="stock-table-body" onClick={(e) => {navigate(`/stocks/${stock.id}`)}}>{stock.name}</td>
                                    <td>{stock.currentPrice.toFixed(2)}</td>
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
                                            onClick={() => handleBuy(stock, buyQuantities[stock.id], user?.id)}
                                            disabled={!buyQuantities[stock.id] || errors[stock.id]}
                                        >
                                            Buy
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="buy-button"
                                            onClick={() => handleRemove(stock)}
                                        >
                                            Remove
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


