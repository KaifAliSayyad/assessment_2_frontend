import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Forms.css';

function ChangePassword() {
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const username = useSelector(state => state.user?.username);

    useEffect(() => {
        if (!username) {
            navigate('/login');
        }
    }, [username, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPasswords(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setErrorMessage("New passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/register/forgotPassword/${username}`, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to change password");
        }
    };

    // Don't render the form until we verify the user is authenticated
    if (!username) {
        return null;
    }

    return (
        <div>
            <div className="login-container">
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="old-password">Old Password</label>
                        <input
                            type="password"
                            id="old-password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password">New Password</label>
                        <input
                            type="password"
                            id="new-password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-new-password">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirm-new-password"
                            name="confirmNewPassword"
                            value={passwords.confirmNewPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-group">
                        <button type="submit">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
