import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './components/forms/Login.jsx';
import Home from './components/Home.jsx';
import BrowseHotels from './components/BrowseHotels.jsx';
import './index.css';
import Signup from './components/forms/signup.jsx';
import Profile from './components/forms/Profile.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="explore" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="browse" element={<BrowseHotels />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
