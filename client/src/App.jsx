import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Register } from './Register';
import { Main } from './Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
