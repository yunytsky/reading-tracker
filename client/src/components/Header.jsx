import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

const Header = () => {
    return(
        <header className="header">
            <Link to="/library" className="logo">
                <img src={logo}/>
                LitLog
            </Link>
            <nav className="header-nav">
                <div className="header-nav-left">
                    <NavLink to="/library" className={({ isActive }) => (isActive ? "active" : "")}>Library</NavLink>
                    <NavLink to="/review" className={({ isActive }) => (isActive ? "active" : "")}>Review</NavLink>
                </div>
                <div className="header-nav-right">
                    <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Profile</NavLink>
                </div>
            </nav>

        </header>
    );
};

export default Header;