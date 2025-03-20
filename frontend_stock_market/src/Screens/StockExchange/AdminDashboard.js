import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import './AdminDashboard.css';
import { removeAdmin } from "../../ReduxComps/actions";

function AdminDashboard() {
    const admin = useSelector(state => state.admin);
    const navigate = useNavigate();

    const [stocks, setStocks] = useState([]);
    const dispatch = useDispatch();

    const getStocks = async () => {
        // const response = await axios.get('http://localhost:8081/stocks');
        // setStocks(response.data);
    }

    useEffect(() => {
        if (!admin) {
            navigate('/admin');
        }
        getStocks();
    }, [admin, navigate, stocks]);

    const handleDelete = async (id) => {
        let sure = window.confirm("Are you sure you want to delete this stock?");
        if (!sure) return;
        const response = await axios.delete(`http://localhost:8081/stocks/${id}`);
        if (response.status === 200) {
            alert("Stock deleted successfully");
        }
        else {
            alert("Failed to delete stock");
        }
    }

    const handleLogOut = () => {
        dispatch(removeAdmin());
        navigate('/admin');
    }

    return (
        <div id="admin-dashboard">
            <div id="logout-button-container">
                <button id="logout-button" onClick={handleLogOut}>Logout</button>
            </div>
            <h1 id="dashboard-title">Admin Dashboard</h1>
            <table id="stock-table">
                <thead>
                    <tr>
                        <th id="stock-id-header">Stock ID</th>
                        <th id="stock-name-header">Stock Name</th>
                        <th id="stock-price-header">Stock Current Price</th>
                        <th id="stock-quantity-header">Stock Quantity</th>
                        <th id="stock-min-price-header">Stock Minimum Price</th>
                        <th id="stock-max-price-header">Stock Maximum Price</th>
                        <th id="actions-header"></th>
                        <th id="actions-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {/* {stocks.map((stock) => (
                <tr key={stock.id}>
                    <td>{stock.id}</td>
                    <td>{stock.name}</td>
                    <td>{stock.currentPrice}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.minPrice}</td>
                    <td>{stock.maxPrice}</td>
                    <td>
                        <button onClick={() => handleDelete(stock.id)}>Delete</button>
                        <button>Update</button>
                    </td>
                </tr>
            ))} */}
                    <tr id="stock-row-1">
                        <td id="stock-id-1">1</td>
                        <td id="stock-name-1">Apple</td>
                        <td id="stock-price-1">100</td>
                        <td id="stock-quantity-1">1000</td>
                        <td id="stock-min-price-1">50</td>
                        <td id="stock-max-price-1">150</td>
                        <td id="actions-1">
                            <button id="delete-button-1" onClick={() => handleDelete(1)}>Delete</button>
                        </td>
                        <td id="actions-1">
                            <button id="update-button-1">Update</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <button id="add-stock-button" onClick={() => navigate('/admin/add-stock')}>Add Stock</button>
        </div>

    );
}

export default AdminDashboard;
