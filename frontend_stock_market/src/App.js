import './App.css';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Screens/Register';
import Login from './Screens/Login';
import ChangePassword from './Screens/ChangePassword';
import ForgotPassword from './Screens/ForgotPassword';
import AdminLogin from './Screens/StockExchange/AdminLogin';
import AdminDashboard from './Screens/StockExchange/AdminDashboard';
import { Provider } from 'react-redux';
import store from './ReduxComps/store';
import AddStock from './Screens/StockExchange/AddStock';
import Watchlist from './Screens/WatchList/WatchList';
import Holdings from './Screens/Holdings/Holdings';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <div className="content">
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/add-stock" element={<AddStock></AddStock>} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/holding" element={<Holdings />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;



