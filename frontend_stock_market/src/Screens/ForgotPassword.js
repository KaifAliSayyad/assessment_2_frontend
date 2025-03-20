import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Forms.css';

function ForgotPassword() {
    const [step, setStep] = useState(1); // Step 1: Verify user, Step 2: New password
    const [formData, setFormData] = useState({
        username: '',
        dob: '',
        newPassword: '',
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

    const handleVerifyUser = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8080/register/verify-user', {
                username: formData.username,
                dob: formData.dob
            });

            if (response.status === 200) {
                setStep(2); // Move to password reset step
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Invalid username or date of birth");
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/register/forgotPassword/${formData.username}`, {
                newPassword: formData.newPassword
            });

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div>
            <div className="login-container">
                <h2>Forgot Password</h2>
                {step === 1 ? (
                    <form onSubmit={handleVerifyUser} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
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
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <div className="form-group">
                            <button type="submit">Verify</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="login-form">
                        <div className="form-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <div className="form-group">
                            <button type="submit">Reset Password</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
