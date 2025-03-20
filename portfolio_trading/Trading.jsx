import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function Trading() {
  const [stocks, setStocks] = useState([
    {
      id: '1',
      name: 'IBM',
      available: 1000,
      currentPrice: 600,
      priceRange: {
        min: 500,
        max: 800
      }
    }
  ]);

  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [orderType, setOrderType] = useState('buy');

  useEffect(() => {
    const handleTradeInitiation = (event) => {
      const { stock, action } = event.detail;
      setSelectedStock(stock);
      setOrderType(action);
      setQuantity(0); // Reset quantity
      
      // Scroll trading section into view
      document.getElementById('trading-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('initiateTrade', handleTradeInitiation);

    return () => {
      window.removeEventListener('initiateTrade', handleTradeInitiation);
    };
  }, []);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  const handleOrder = () => {
    if (!selectedStock || quantity <= 0) return;
    
    // Here you would typically make an API call to process the order
    alert(`Order placed: ${orderType === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${selectedStock.name}`);
    
    setQuantity(0);
    setSelectedStock(null);
  };

  return (
    <div id="trading-section" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Trading</h1>
        </div>

        {/* Stock List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Available Stocks</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Available</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(stock => (
                    <tr key={stock.id} className="border-b">
                      <td className="py-4">{stock.name}</td>
                      <td>₹{stock.currentPrice}</td>
                      <td>{stock.available}</td>
                      <td>
                        <button
                          onClick={() => setSelectedStock(stock)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Place Order</h2>
            
            {selectedStock ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Stock
                  </label>
                  <div className="text-lg font-semibold">{selectedStock.name}</div>
                  <div className="text-sm text-gray-600">
                    Current Price: ₹{selectedStock.currentPrice}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setOrderType('buy')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        orderType === 'buy'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ArrowUpCircle className="w-5 h-5" />
                      Buy
                    </button>
                    <button
                      onClick={() => setOrderType('sell')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        orderType === 'sell'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ArrowDownCircle className="w-5 h-5" />
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Total Amount:</span>
                    <span className="font-semibold">
                      ₹{(quantity * selectedStock.currentPrice).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handleOrder}
                    disabled={quantity <= 0}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                      quantity > 0
                        ? orderType === 'buy'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.name}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a stock to start trading
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}