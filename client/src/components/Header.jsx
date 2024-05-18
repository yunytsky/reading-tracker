import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import arrowIcon from "../assets/arrow.svg";
import logoutIcon from "../assets/logout.svg";
import settingsIcon from "../assets/settings.svg";
import { getAvatars, logout } from "../api";

const Header = () => {
    const {user, setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const [userAvatarPath, setUserAvatarPath] = useState("");

    const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
    const profileDropdownRef = useRef(null);
    const profileDropdownButtonRef = useRef(null);

    const handleLogout = async () => {
      try {
        const config = {withCredentials: true}
        const res = await logout(config);
        console.log(res)
        localStorage.removeItem("user");
        setUser(null);
        setProfileDropdownVisible(false);
      } catch (error) {
        console.log(error);
      }
    }

    //Hide popup-form/dropdown-menu when clicked elsewhere
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          profileDropdownRef.current !== null &&
          !profileDropdownRef.current.contains(event.target) &&
          profileDropdownButtonRef.current !== null &&
          !profileDropdownButtonRef.current.contains(event.target)
        ) {
          setProfileDropdownVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    //Update avatar
    useEffect(() => {
      const fetchData = async () => {
        const res = await getAvatars();
        const userAvatar = res.data.avatars.find(avatar => avatar.avatarId === user.avatarId);
        setUserAvatarPath(userAvatar.path);
      }

      if(user){
        fetchData();
      }
    }, [user])

    return (
      <>
        {user ? (
          <header className="header">
            <Link to="/library" className="logo">
              <img src={logo} />
              LitLog
            </Link>
            <nav className="header-nav">
              <div className="header-nav-left">
                <NavLink
                  to="/library"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Library
                </NavLink>
                <NavLink
                  to="/review/books-stats"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Review
                </NavLink>
              </div>
              <div className="header-nav-right">
                <div className="header-nav-profile">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "header-nav-profile-link active"
                        : "header-nav-profile-link"
                    }
                  >
                    Profile
                  </NavLink>

                  <button
                    onClick={() => {
                      setProfileDropdownVisible((prevVisible) => !prevVisible);
                    }}
                    ref={profileDropdownButtonRef}
                    className="header-nav-profile-button"
                  >
                    <img
                      src={`http://localhost:3000/img/avatars/${userAvatarPath}`}
                      alt="avatar"
                      className="header-avatar"
                    />
                    <img
                      src={arrowIcon}
                      alt="menu"
                      className="header-nav-profile-button-arrow"
                    />
                  </button>

                  {profileDropdownVisible && (
                    <div
                      ref={profileDropdownRef}
                      className="header-nav-profile-dropdown"
                    >
                      <div className="header-nav-profile-dropdown-options">
                        <div
                          className="header-nav-profile-dropdown-option"
                          onClick={() => {
                            navigate("/profile");
                            setProfileDropdownVisible(false);
                          }}
                        >
                          <img src={settingsIcon} alt="profile" />
                          <span>Profile</span>
                        </div>
                        <div
                          className="header-nav-profile-dropdown-option"
                          onClick={handleLogout}
                        >
                          <img src={logoutIcon} alt="logout" />
                          <span>Log out</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </header>
        ) : (
          <header className="header unauth">
            <Link to="/" className="logo">
              <img src={logo} />
              LitLog
            </Link>
            <nav className="header-nav">
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Sign up
              </NavLink>
            </nav>
          </header>
        )}
      </>
    );
};

export default Header;