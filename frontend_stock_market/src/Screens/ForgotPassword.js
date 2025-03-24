import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Forms.css';

function ForgotPassword() {
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

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const dob = formData.dob; 
            const dateParts = dob.split("-"); 
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; 

            const response = await axios.put(`http://localhost:9999/register/forgotPassword/${formData.username}`, {
                dob: formattedDate,
                new_password: formData.newPassword
            });

            if (response.status === 200) {
                alert("Password reset successful");
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
                    <form onSubmit={handleResetPassword} className="login-form">
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
                        <div className="form-group">
                            <label htmlFor="username">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {errorMessage && <p className="form-group error">{errorMessage}</p>}
                        <div className="form-group">
                            <button type="submit">Verify</button>
                        </div>
                    </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
