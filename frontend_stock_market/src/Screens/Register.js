import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Forms.css';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        dob: '',
        balance: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return false;
        }

        const birthDate = new Date(formData.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setErrorMessage("You must be at least 18 years old to register");
            return false;
        }

        if (parseFloat(formData.balance) < 0) {
            setErrorMessage("Initial balance cannot be negative");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register/signup', {
                name: formData.fullName,
                username: formData.username,
                dob: formData.dob,
                balance: parseFloat(formData.balance),
                password: formData.password
            });

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Registration failed. Please try again.");
            } else {
                setErrorMessage("Network error. Please try again later.");
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="balance">Initial Balance</label>
                        <input
                            type="number"
                            id="balance"
                            name="balance"
                            value={formData.balance}
                            onChange={handleInputChange}
                            placeholder="Enter initial balance"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="login-button">Register</button><br></br><br></br>
                    <div className="register-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
