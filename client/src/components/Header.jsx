import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Header = () => {
    return(
        <header className="header">
            <div className="logo">
                <img src={logo}/>
                LitLog
            </div>
            <nav className="header-nav">
                <div className="header-nav-left">
                    <Link>Library</Link>
                    <Link>Review</Link>
                </div>
                <div className="header-nav-right">
                    <Link>Profile</Link>
                </div>
            </nav>

        </header>
    );
};

export default Header;