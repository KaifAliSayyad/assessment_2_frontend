import React, { useState } from 'react';
import { Wallet, LineChart, Eye, DollarSign } from 'lucide-react';

export default function Portfolio() {
  const [balance, setBalance] = useState(100000); // Max initial deposit 1 Lakh
  const [holdings, setHoldings] = useState([
    {
      id: '1',
      name: 'IBM',
      quantity: 10,
      buyPrice: 550,
      currentPrice: 600
    }
  ]);
  const [watchlist, setWatchlist] = useState([
    {
      id: '1',
      name: 'AAPL',
      currentPrice: 750,
      dayChange: 2.5
    }
  ]);

  const calculatePortfolioValue = () => {
    return holdings.reduce((total, stock) => {
      return total + (stock.quantity * stock.currentPrice);
    }, 0);
  };

  const calculateTotalProfitLoss = () => {
    return holdings.reduce((total, stock) => {
      return total + (stock.quantity * (stock.currentPrice - stock.buyPrice));
    }, 0);
  };

  const handleBuyFromWatchlist = (item) => {
    // Navigate to Trading component with pre-selected stock and buy action
    window.dispatchEvent(new CustomEvent('initiateTrade', {
      detail: {
        stock: {
          id: item.id,
          name: item.name,
          currentPrice: item.currentPrice,
          available: 1000 // Default available quantity
        },
        action: 'buy'
      }
    }));
  };

  const handleSellFromHoldings = (stock) => {
    // Navigate to Trading component with pre-selected stock and sell action
    window.dispatchEvent(new CustomEvent('initiateTrade', {
      detail: {
        stock: {
          id: stock.id,
          name: stock.name,
          currentPrice: stock.currentPrice,
          available: stock.quantity
        },
        action: 'sell'
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <Wallet className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold">₹{balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <LineChart className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold">₹{calculatePortfolioValue().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total P&L</p>
                <p className={`text-2xl font-bold ${calculateTotalProfitLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{calculateTotalProfitLoss().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Avg. Buy Price</th>
                  <th className="pb-3">Current Price</th>
                  <th className="pb-3">P&L</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(stock => (
                  <tr key={stock.id} className="border-b">
                    <td className="py-4">{stock.name}</td>
                    <td>{stock.quantity}</td>
                    <td>₹{stock.buyPrice}</td>
                    <td>₹{stock.currentPrice}</td>
                    <td className={`font-semibold ${(stock.currentPrice - stock.buyPrice) * stock.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{((stock.currentPrice - stock.buyPrice) * stock.quantity).toLocaleString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleSellFromHoldings(stock)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Watchlist */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Watchlist</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Current Price</th>
                  <th className="pb-3">Day Change</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{item.name}</td>
                    <td>₹{item.currentPrice}</td>
                    <td className={item.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.dayChange}%
                    </td>
                    <td>
                      <button
                        onClick={() => handleBuyFromWatchlist(item)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}