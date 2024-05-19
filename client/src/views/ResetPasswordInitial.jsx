import { useContext, useEffect, useState } from "react";
import {AuthContext} from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import EmailForm from "../components/forms/EmailForm";

const ResetPasswordInitial = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate("/library");
      }
    }, [user]);  

 

    return (
      <div className="reset-password-initial">
         <h3>Enter your email</h3>
         <EmailForm/>

      </div>
    );
}

export default ResetPasswordInitial;
