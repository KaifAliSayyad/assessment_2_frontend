import React from 'react';
import './Header.css';

function Header() {
    return (
        <header>
            <div class="logo">
                <h1>Stock Market</h1>
                <p>Management System</p>
            </div>
            <nav>
                <ul>
                    <li><a >WatchList</a></li>
                    <li><a >Holding</a></li>
                    <li><a >Balance</a></li>
                    <li><a >Register</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;