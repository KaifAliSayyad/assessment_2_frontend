import React, { useEffect, useState } from 'react';
import '../Forms.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AddStock() {
    const [stock, setStock] = useState({ "name": "", "minPrice": 0, "maxPrice": 20, "currentPrice": 0, "quantity": 0});
    const admin = useSelector(state => state.admin);
    const navigate = useNavigate();

    useEffect(() => {
        if (!admin) {
            navigate('/admin');
        }
    }, [admin]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setStock(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(stock);
        if(stock.minPrice > stock.maxPrice){
            alert("Minimum price should be less than maximum price");
            return;
        }
        if(stock.currentPrice < stock.minPrice || stock.currentPrice > stock.maxPrice){
            alert("Stock price should be between min and max price");
            return;
        }
        try {
            const response = await axios.post('http://localhost:8081/stocks', stock);
            if (response.status === 200) {
                alert("Stock added successfully");
                navigate('/admin-dashboard');
            }
            else {
                alert("Failed to add stock");
            }
        } catch (error) {
            alert("Failed to add stock");
            console.error(error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Add Stock</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="stock-name">Stock Name</label>
                        <input
                            type="text"
                            id="stock-name"
                            value={stock.name}
                            onChange={handleInputChange}
                            name="name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock-price">Stock Minimum Price</label>
                        <input
                            type="number"
                            id="stock-price"
                            value={stock.minPrice}
                            onChange={handleInputChange}
                            name="minPrice"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock-price">Stock Maximum Price</label>
                        <input
                            type="number"
                            id="stock-price"
                            value={stock.maxPrice}
                            onChange={handleInputChange}
                            name="maxPrice"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock-price">Stock Price</label>
                        <input
                            type="number"
                            id="stock-price"
                            value={stock.currentPrice}
                            onChange={handleInputChange}
                            name="currentPrice"
                            min={stock.minPrice}
                            max={stock.maxPrice}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock-price">Stock Quantity</label>
                        <input
                            type="number"
                            id="stock-price"
                            value={stock.quantity}
                            onChange={handleInputChange}
                            name="quantity"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Add Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStock;
