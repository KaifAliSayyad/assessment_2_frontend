import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <div className="logo">
                <h1>Stock Market</h1>
                <p>Management System</p>
            </div>
            <nav>
                <ul>
                    <li><Link to="/watchlist">WatchList</Link></li>
                    <li><Link to="/holding">Holding</Link></li>
                    <li><Link to="/balance">Balance</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/change-password">Change Password</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
