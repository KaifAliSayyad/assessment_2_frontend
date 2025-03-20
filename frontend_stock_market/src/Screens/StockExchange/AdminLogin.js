import React from 'react';
import '../Forms.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../ReduxComps/actions';

function AdminLogin() {
    const [user, setUser] = useState({ "id": "", "password": "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitLogin = (event) =>{
        event.preventDefault();
        console.log(user);
        if(user.id === "admin" && user.password === "admin"){
            dispatch(setAdmin(user));
            navigate('/admin-dashboard');
        }
        else{
            alert("Invalid credentials");
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Admin Login</h1>
                <form className="login-form" onSubmit={submitLogin}>
                    <div className="form-group">
                        <label htmlFor="netbanking-id">Your User Name</label>
                        <input
                            type="text"
                            id="netbanking-id"
                            name="id"
                            value={user.id}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
                    <div className="form-group">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
