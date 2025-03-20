import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Holdings.css';
import axios from 'axios';

export default function Holdings() {
    const user = useSelector(state => state.user);
    const [holdings, setHoldings] = useState([
        {
            id: 1,
            stock: {
                id: 1,
                name: "TCS",
                quantity: 100,
                minPrice: 3000,
                maxPrice: 4000,
                currentPrice: 3600
            },
            averageBuyPrice: 3500,
            purchasedQuantity: 10
        },
        {
            id: 2,
            stock: {
                id: 2,
                name: "Infosys",
                quantity: 150,
                minPrice: 1200,
                maxPrice: 1800,
                currentPrice: 1450
            },
            averageBuyPrice: 1500,
            purchasedQuantity: 15
        },
        {
            id: 3,
            stock: {
                id: 3,
                name: "HDFC Bank",
                quantity: 200,
                minPrice: 1400,
                maxPrice: 1900,
                currentPrice: 1650
            },
            averageBuyPrice: 1600,
            purchasedQuantity: 20
        }
    ]);
    const [sellQuantities, setSellQuantities] = useState({});
    const [error, setError] = useState({});
    const [budget, setBudget] = useState(100000); // Add this line for demo budget
    
    const sellApi = async (holding) => {
        const response = await axios.post(`http://localhost:8080//trading/sell`, {
            user_id : user?.id,
            stock_id : holding.stock.id,
            quantity : sellQuantities[holding.id]
        });
    };

    const handleQuantityChange = (holdingId, value) => {
        const quantity = parseInt(value) || 0;
        const holding = holdings.find(h => h.id === holdingId);
        
        if (quantity > holding.purchasedQuantity) {
            setError(prev => ({
                ...prev,
                [holdingId]: `Maximum ${holding.purchasedQuantity} shares available to sell`
            }));
        } else {
            setError(prev => {
                const newError = { ...prev };
                delete newError[holdingId];
                return newError;
            });
        }

        setSellQuantities(prev => ({
            ...prev,
            [holdingId]: quantity
        }));
    };

    const handleSell = (holding) => {
        const sellQuantity = sellQuantities[holding.id] || 0;
        if (sellQuantity <= 0) {
            setError(prev => ({
                ...prev,
                [holding.id]: 'Please enter a valid quantity to sell'
            }));
            return;
        }
        if (sellQuantity > holding.purchasedQuantity) {
            return;
        }
        sellApi({
            ...holding,
            purchasedQuantity: sellQuantity
        });
        setHoldings(prev => prev.filter(item => item.id !== holding.id));
        setSellQuantities(prev => {
            const newQuantities = { ...prev };
            delete newQuantities[holding.id];
            return newQuantities;
        });
    };

    const calculateProfitLoss = (holding) => {
        return (holding.stock.currentPrice - holding.averageBuyPrice) * holding.purchasedQuantity;
    };

    return (
        <div className="holdings-container">
            <div className="holdings-header">
                <h1>My Holdings</h1>
                <div className="budget">
                    Budget: ₹{budget.toLocaleString()}
                </div>
            </div>

            {holdings.length === 0 ? (
                <div className="empty-holdings">
                    <p>You don't have any holdings yet</p>
                </div>
            ) : (
                <div className="holdings-table-container">
                    <table className="holdings-table">
                        <thead>
                            <tr>
                                <th>Stock Name</th>
                                <th>Quantity</th>
                                <th>Buy Price (₹)</th>
                                <th>Current Price (₹)</th>
                                <th>Total Investment (₹)</th>
                                <th>Current Value (₹)</th>
                                <th>P&L (₹)</th>
                                <th>Sell Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map(holding => {
                                const profitLoss = calculateProfitLoss(holding);
                                const totalInvestment = holding.averageBuyPrice * holding.purchasedQuantity;
                                const currentValue = holding.stock.currentPrice * holding.purchasedQuantity;

                                return (
                                    <tr key={holding.id}>
                                        <td>{holding.stock.name}</td>
                                        <td>{holding.purchasedQuantity}</td>
                                        <td>{holding.averageBuyPrice.toFixed(2)}</td>
                                        <td>{holding.stock.currentPrice.toFixed(2)}</td>
                                        <td>{totalInvestment.toFixed(2)}</td>
                                        <td>{currentValue.toFixed(2)}</td>
                                        <td className={`profit-loss ${profitLoss >= 0 ? 'profit' : 'loss'}`}>
                                            {profitLoss.toFixed(2)}
                                        </td>
                                        <td>
                                            <div className="quantity-input-container">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={holding.purchasedQuantity}
                                                    value={sellQuantities[holding.id] || ''}
                                                    onChange={(e) => handleQuantityChange(holding.id, e.target.value)}
                                                    className="quantity-input"
                                                />
                                                {error[holding.id] && (
                                                    <div className="error-message">{error[holding.id]}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                className="sell-button"
                                                onClick={() => handleSell(holding)}
                                                disabled={!sellQuantities[holding.id] || error[holding.id]}
                                            >
                                                Sell
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="total-label">Portfolio Totals:</td>
                                <td>
                                    {holdings.reduce((sum, holding) => 
                                        sum + (holding.averageBuyPrice * holding.purchasedQuantity), 0).toFixed(2)}
                                </td>
                                <td>
                                    {holdings.reduce((sum, holding) => 
                                        sum + (holding.stock.currentPrice * holding.purchasedQuantity), 0).toFixed(2)}
                                </td>
                                <td className={`profit-loss ${holdings.reduce((sum, holding) => 
                                    sum + calculateProfitLoss(holding), 0) >= 0 ? 'profit' : 'loss'}`}>
                                    {holdings.reduce((sum, holding) => 
                                        sum + calculateProfitLoss(holding), 0).toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}


