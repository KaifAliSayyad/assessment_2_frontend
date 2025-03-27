import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashBar from '../../Components/DashBar';
import '../WatchList/WatchList.css';
import buyStock from '../../BuyStock';

function Dashboard() {
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
            const fetchStocks = async () => {
                try {
                    const response = await axios.get(`http://localhost:9999/stocks`);
                    setWatchlist(response.data);
                } catch (err) {
                    console.error('Watchlist fetch error:', err);
                }
            };
            const calculateCurrentValue = async () => {
                const res = await axios.get("http://localhost:9999/portfolio/"+user.id+"/value");
                setCurrentValue(res.data);
            };
            fetchBudget();
            fetchStocks();
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

    const handleBuy = async (stock) => {
        await buyStock(stock, buyQuantities[stock.id], user?.id);
        onLoading();
    };

    const calculateTotalInvestment = () => {
        return totalInvestment; // Watchlist doesn't have investments
    };

    

    const AddToWatchlist = async (stock) => {
        try{
            const response = await axios.post(`http://localhost:9999/portfolio/${user.id}/watchlist`, stock);
            if(response.status === 200){
                alert("Stock added to watchlist successfully");
            }
        }
        catch(err){
            console.log(err);
        }
    };

    return (
        <div className="watchlist-container">
            <DashBar
                budget={budget}
                totalInvestment={totalInvestment}
                currentValue={currentValue}
            />
            <div className="holdings-header">
                <h1>DashBoard</h1>
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
                                    <td>{stock.name}</td>
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
                                            onClick={() => handleBuy(stock)}
                                            disabled={!buyQuantities[stock.id] || errors[stock.id]}
                                        >
                                            Buy
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="buy-button"
                                            onClick={() => AddToWatchlist(stock)}
                                        >
                                            Add to Watchlist
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

export default Dashboard; 
