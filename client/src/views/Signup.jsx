import { useContext, useEffect } from "react";
import SignupForm from "../components/forms/SignupForm";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(user) {
            navigate("/library")
        }
    }, [user])
    
    return(
        <div className="signup">
            <h3>Sign up</h3>
            <SignupForm/>
        </div>
    );
};

export default Signup;