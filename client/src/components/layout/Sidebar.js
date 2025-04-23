import React, { useState, useEffect } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import '../../style/Sidebar.css';
import { IconContext } from 'react-icons';

import Topbar from './Topbar';

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [user, setUser] = useState(null);

  const showSidebar = () => setSidebar(!sidebar);
  
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
        // navigate to logout
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
        <div className={sidebar ? 'navbar shift-right' : 'navbar'}>
          <Link to="#" className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar}/>
          </Link>
          <Topbar/>
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
