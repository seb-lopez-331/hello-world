import React from 'react';
import {
  Nav, 
  NavLink, 
  NavMenu, 
  NavBtn, 
  NavBtnLink,
  Heading,
} from './TopbarElements';
import { useLocation } from 'react-router-dom';

const Topbar = ({ user }) => {
  const location = useLocation();
  const path = location.pathname;
  const showDateRangePicker = ['/'].includes(path);

  return (
    <>
      <Nav>
        <Heading>
          <h1>User: {user.username}</h1>
        </Heading>
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
          <NavBtnLink to="/signin">Log Out</NavBtnLink>
        </NavBtn>
      </Nav>   
    </>
  );
};

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

export default Topbar;