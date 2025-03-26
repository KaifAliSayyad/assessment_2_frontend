import React from 'react';
import './DashBar.css';

function DashBar({ budget, totalInvestment, currentValue }) {
    const profitLoss = currentValue - totalInvestment;
    const profitLossPercentage = ((currentValue - totalInvestment) / totalInvestment * 100) || 0;

    return (
        <div className="dash-bar">
            <div className="dash-item">
                <h3>Available Budget</h3>
                <p>₹{budget?.toLocaleString() || 0}</p>
            </div>
            <div className="dash-item">
                <h3>Total Investment</h3>
                <p>₹{totalInvestment?.toLocaleString() || 0}</p>
            </div>
            <div className="dash-item">
                <h3>Current Value</h3>
                <p>₹{currentValue?.toLocaleString() || 0}</p>
            </div>
            <div className="dash-item">
                <h3>Profit/Loss</h3>
                <p className={`${profitLoss >= 0 ? 'profit' : 'loss'}`}>
                    ₹{profitLoss?.toLocaleString() || 0}
                    <span className="percentage">
                        ({profitLossPercentage.toFixed(2)}%)
                    </span>
                </p>
            </div>
        </div>
    );
}

export default DashBar;
