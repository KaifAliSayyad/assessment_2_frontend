import './App.css';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Screens/Register';
import Login from './Screens/Login';

function App() {
  return (
    <div className="App">
      <Header></Header>

      <div class="content">
        <Router>
          <div class="main-content">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </div>

      <Footer></Footer>
    </div >
  );
}

export default App;
