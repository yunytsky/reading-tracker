import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import mainImage from "../assets/main-bg-2.svg";
import { Link } from "react-router-dom";

const Main = () => {
    const {user} = useContext(AuthContext);
    
    useEffect(() => {
        if(user) {
            navigate("/library")
        }
    }, [user])
    
    return (
      <div className="main">
        <div className="main-image">
          <img src={mainImage} alt="books and glasses" />
        </div>
        <h2 className="main-heading">Stay on Track with LitLog</h2>
        <p className="main-subheading">
        LitLog is the ultimate tool for organizing and optimizing your reading experience. Keep track of the books you've read, plan future reads, and gain valuable insights into your reading habits. 
        </p>
        <div className="main-buttons">
        <Link to={"/signup"} className="button empty">
          Sign up
        </Link>
          <Link to={"/login"} className="button">
            Log in
          </Link>
        </div>
      </div>
    );
};

export default Main;