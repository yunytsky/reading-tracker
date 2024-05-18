import { useContext, useEffect } from "react";
import LoginForm from "../components/forms/LoginForm";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(user) {
            navigate("/library")
        }
    }, [user])
    
    return(
        <div className="login">
            <h3>Login</h3>
            <LoginForm/>
        </div>
    );
};

export default Login;