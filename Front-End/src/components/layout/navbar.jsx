import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { userService } from '../../services/userService.js';
import "../../index.css";

function Navbar() {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
    }
  }, []);

  const handleLogout = () => {
    userService.logout();
    setUser(null);
    navigate('/');
  };
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="items-left ml-0.8"><img src={logo} alt="logo.png" style={{height:'200px', width:"200px"}}/></div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 justify-end">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                  ${isActive ? 'bg-red-200 text-orange-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                Home
              </NavLink>
              {(user==null)?<NavLink 
                to="/login"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                  ${isActive ? 'bg-red-200 text-orange-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                Login 
              </NavLink>:<NavLink 
                to="/profile"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                  ${isActive ? 'bg-red-200 text-orange-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                Profile
              </NavLink>}
              {(user==null)?<NavLink 
                to="/signup"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                  ${isActive ? 'bg-red-200 text-orange-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                Sign-up
              </NavLink>
              :<button 
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Logout
              </button>
              }

              
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
