import React, { useState, useEffect } from 'react';
import useUser from '../utils/useUser';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import { IconContext } from 'react-icons';

import Topbar from './Topbar';
import { SidebarData } from './SidebarData';

import '../../style/Layout.css';

const protectedPaths = ['/dashboard'];

const AppLayout = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  
  const user = useUser();
  console.log(user);
  const location = useLocation();

  const handleLogout = async () => {
    const serverUrl = process.env.REACT_APP_SERVER;
    try {
      const res = await fetch(`${serverUrl}/auth/logout`, {
        method: "POST",
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
      } else {
        console.error("Failed to fetch user data");
      } 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    window.location.reload();
  }

  const isProtected = protectedPaths.some((path) => location.pathname.startsWith(path));
  
  if ((user == {}) && isProtected) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return user ? (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className={sidebar ? 'navbar shift-right' : 'navbar'}>
          <Link to="#" className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar}/>
          </Link>
          <Topbar user={user} handleLogout={handleLogout}/>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items'>
            <li className="navbar-toggle" onClick={showSidebar}>
              <Link to="#" className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </IconContext.Provider>
      <Outlet />
    </>
  ) : (
    <>
      <Topbar/>
      <Outlet/>
    </>
  );
};

export default AppLayout;