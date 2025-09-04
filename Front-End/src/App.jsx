import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/layout/navbar.jsx';
import Footer from './components/layout/footer.jsx';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar className="sticky top-0 z-50" />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer className="mt-auto" />
      </div>
    </AuthProvider>
  );
}

export default App;
