import React,{useState, useEffect} from "react";
import {
  Operations,
  Home,
  SprintPlanning,
  Backlogs,
  Bugs,
  Releases,
} from "../../assets/allsvg";
import lightLogo from "../../assets/images/logo-light.svg";
import "./SideNav.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { logout } from "../../app/features/Engineering/EngineeringSlice";
import { useDispatch } from "react-redux";
import AccordianArrow from "../../assets/arrow-accordian.svg"

const SideNav = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [currentPath, setCurrentPath] = useState(location.pathname)
  const [toggleAccordian, setToggleAccordian] = useState({"engg": false})
  const enggRoutes = ['/sprintplanning','/backlogs','/bugs','/releases'];
  useEffect(()=>{
    setCurrentPath(location.pathname)
  },[location.pathname])
 
  return (
    <div className="sidenav-container">
      <div className="sidenav-items-container">
        <div className="grey-bg">
          <img src={lightLogo} />
        </div>
        <div className="sidenav-items">
          <ul className="sidenav-ul list-group">
            <NavLink to="/workspace">
              <li
                className={`sidenav-li ${
                  location.pathname.slice(1).startsWith("workspace")
                    ? "sidenav-li-active"
                    : ""
                }`}
              >
                <Home className="sidenav-icons" />
                <span className="sidenav-item-title">Workspace</span>
              </li>
            </NavLink>
            <div className="nav-dropdown-title" onClick={()=>{
              setToggleAccordian(prev => ({...prev, "engg": !prev["engg"]}))
            }}>
              Engineering
              <div >
              <img src={AccordianArrow} alt="accordian arrow" className={`img-sm ${toggleAccordian["engg"]}`} />
              </div>
            </div>
            {(toggleAccordian["engg"]===true || enggRoutes.includes(currentPath)) && <div>
            <NavLink to={"/sprintplanning"}>
              <li className={`sidenav-li`}>
                <SprintPlanning className="sidenav-icons" />
                <span className="sidenav-item-title">Sprint Planning</span>
              </li>
            </NavLink>
            <NavLink to={"/backlogs"}>
              <li
                className={`sidenav-li  ${
                  location.pathname.slice(1).startsWith("backlogs")
                    ? "sidenav-li-active"
                    : ""
                }`}
              >
                <Backlogs className="sidenav-icons" />
                <span className="sidenav-item-title">Backlogs Tracker</span>
              </li>
            </NavLink>
            <NavLink to={"/bugs"}>
              <li
                className={`sidenav-li ${
                  location.pathname.slice(1).startsWith("bugs")
                    ? "sidenav-li-active"
                    : ""
                }`}
              >
                <Bugs className="sidenav-icons" />
                <span className="sidenav-item-title">Bugs Tracker</span>
              </li>
            </NavLink>
            <NavLink to={"/releases"}>
              <li className={`sidenav-li ${
                  location.pathname.slice(1).startsWith("releases")
                    ? "sidenav-li-active"
                    : ""
                }`}>
                <Releases className="sidenav-icons" />
                Release Tracker
              </li>
            </NavLink>

            <li className="sidenav-li">
              <Operations className="sidenav-icons" />
              Operations
            </li>

            </div>}
            
          </ul>
        </div>
        <button className="logout-btn" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>
    </div>
  );
};
export { SideNav };
