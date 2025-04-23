import React from 'react';
import {
  Nav, 
  NavLink, 
  NavMenu, 
  NavBtn, 
  NavBtnLink
} from './TopbarElements';
import { useLocation } from 'react-router-dom';
import DateRangePicker from '../utils/DateRangePicker';

const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const showDateRangePicker = ['/'].includes(path);

  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>Logo</h1>
        </NavLink>
        <NavMenu>
          <NavLink to="/about" activeStyle>
            About
          </NavLink>
          <NavLink to="/services" activeStyle>
            Services
          </NavLink>
          <NavLink to="/contact-us" activeStyle>
            Contact Us
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/signin">Sign In</NavBtnLink>
        </NavBtn>
      </Nav>   
    </>
  );
};

<div className="navbar">
          <Topbar/>
          {/* <Link to="#" className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar}/>
          </Link>
          <div className="user-info">
            <p>User: { user.username }</p>
          </div>
          <div className={`date-filter ${showDateRangePicker ? 'show' : ''}`}>
            <DateRangePicker/>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button> */}
        </div>

export default Topbar;