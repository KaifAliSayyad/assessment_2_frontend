import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div class="footer-content">
                <p>&copy; 2025 Stock Market. All rights reserved.</p>
                <div class="social-links">
                    <Link to="/" target="_blank" class="social-icon">www.stockmarket.com</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer;