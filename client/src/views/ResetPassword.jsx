import { useContext, useEffect, useState } from "react";
import {AuthContext} from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom";
import NewPasswordForm from "../components/forms/NewPasswordForm";

const ResetPassword = () => {
    const location = useLocation();
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");


    useEffect(() => {
      if (user) {
        navigate("/library");
      }else if(!location.state || !location.state.email){
        navigate("/login");
       }else{
        setEmail(location.state.email);
       }
    }, [user, location]);  



    return (
      <div className="reset-password-initial">
         <h3>Enter new password</h3>
         <NewPasswordForm email={email}/>

      </div>
    );
}

export default ResetPassword;
