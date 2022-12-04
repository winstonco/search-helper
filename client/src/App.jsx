import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Register } from './Register';
import { Main } from './Main';
import { Login } from './Login';

function App() {
  return (
    <div className="App">
      <Login />
      <div className="main">
        <a href="/">
          <h1>Search Helper</h1>
        </a>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Main />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
