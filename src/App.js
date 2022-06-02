import './App.css';
import './index.css';
import { Routes, Route } from "react-router-dom";
import Main from './components/rework/Main'
import LandingPage from './components/rework/LandingPage/LandingPage'
import Simmodel from './components/rework/SimmodelHandler/SimmodelHandler'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/simmodel" element={<Simmodel />} />
        <Route index path="/editor" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
