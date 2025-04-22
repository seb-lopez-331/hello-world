import React, { useState, useEffect } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../../style/Sidebar.css';
import { IconContext } from 'react-icons';

import DateRangePicker from '../utils/DateRangePicker';

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [user, setUser] = useState(null);

  const showSidebar = () => setSidebar(!sidebar);

  const location = useLocation();
  const path = location.pathname;

  const showDateRangePicker = ['/'].includes(path);

  useEffect(() => {
    const fetchUserData = async () => {
      const serverUrl = process.env.REACT_APP_SERVER;
      try {
        const res = await fetch(`${serverUrl}/auth/profile`, {
          credentials: 'include' // ensures cookies are sent
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
        } 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [])

  const handleLogout = async () => {
    const serverUrl = process.env.REACT_APP_SERVER;
    try {
      const res = await fetch(`${serverUrl}/auth/logout`, {
        method: "POST",
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
      } 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return user ? (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className="navbar">
          <Link to="#" className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar}/>
          </Link>
          <div className="user-info">
            <p>User: { user.username }</p> {/* Replace with dynamic user data */}
          </div>
          <div className={`date-filter ${showDateRangePicker ? 'show' : ''}`}>
            <DateRangePicker/>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className="navbar-toggle">
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
    </>
  ) : (<p>Loading</p>);
};

export default Sidebar;
