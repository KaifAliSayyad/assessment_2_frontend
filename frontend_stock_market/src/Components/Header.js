import React from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../ReduxComps/actions';
import { LogOut } from 'lucide-react';

function Header() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = () => {
        dispatch(removeUser());
        navigate('/login');
    }

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
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/change-password">Change Password</Link></li>
                    {user && (
                        <li>
                            <button className="logout-nav-button" onClick={handleLogOut}>
                                <LogOut size={18} />
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
