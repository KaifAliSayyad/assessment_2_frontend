import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../ReduxComps/actions';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Forms.css';

function Login() {
    const [user, setUserState] = useState({ "id": "", "password": "" });
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitLogin = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post('http://localhost:8080/register/login', {
                username: user.id,
                password: user.password
            });

            if (response.status === 200) {
                dispatch(setUser(response.data));
                navigate('/watchlist');
            } else {
                setErrorMessage("Invalid credentials.");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Login failed, please try again.");
            } else {
                setErrorMessage("Something went wrong, please try again.");
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={submitLogin} className="login-form">
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
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-group">
                        <button type="submit">Login</button>
                    </div>
                    <div>
                        <a>
                            <Link to="/register">
                                register
                            </Link>
                        </a> if account doesn't exist
                    </div>
                    <div>
                        <a>
                            <Link to="/forgot-password">
                                Forgot Password ?
                            </Link>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
