import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
    const admin = useSelector(state => state.admin);
    const navigate = useNavigate();

    const[stocks, setStocks] = useState([]);

    const getStocks = async () => {
        const response = await axios.get('http://localhost:8081/stocks');
        setStocks(response.data);
    }

    useEffect(() => {
        if (!admin) {
            navigate('/admin');
        }
        getStocks();
    }, [admin, navigate, stocks]);

    const handleDelete = async (id) => {
        let sure = window.confirm("Are you sure you want to delete this stock?");
        if(!sure) return;
        const response = await axios.delete(`http://localhost:8081/stocks/${id}`);
        if(response.status === 200){
            alert("Stock deleted successfully");
        }
        else{
            alert("Failed to delete stock");
        }
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {/* <ul>
                {stocks.map((stock) => (
                    <li key={stock.id}>
                        {stock.name} - {stock.price}
                    </li>
                ))}
                <button onClick={()=>handleDelete(stock.id)}>delete</button>
                <button onClick={}>update</button>
            </ul> */}
        </div>
    );
}

export default AdminDashboard;
