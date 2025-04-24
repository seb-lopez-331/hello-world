import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";

export const SidebarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text',
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <IoIcons.IoIosSettings />,
    cName: 'nav-text',
  },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: <BiIcons.BiCategory />,
    cName: 'nav-text',
  },
  {
    title: 'Linked Accounts',
    path: '/dashboard/linked-accounts',
    icon: <MdIcons.MdAccountCircle />,
    cName: 'nav-text',
  },
  {
    title: 'Budget Configuration',
    path: '/dashboard/budget-configuration',
    icon: <FaIcons.FaChartPie />,
    cName: 'nav-text',
  },
]