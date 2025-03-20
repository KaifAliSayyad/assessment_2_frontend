import './App.css';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header></Header>

      <div class="content">
        <Router>

          <div class="main-content">
            <Routes>
              
            </Routes>
          </div>
        </Router>
      </div>

      <Footer></Footer>
    </div >
  );
}

export default App;
