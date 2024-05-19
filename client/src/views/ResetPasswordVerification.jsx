import { useContext, useEffect, useState } from "react";
import {AuthContext} from "../context/AuthContext"
import verificationImage from "../assets/verification-bg.svg"
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPasswordReset, sendVerificationCode, verifyAccount } from "../api";

const ResetPasswordVerification = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");

    const [verificationCode, setVerificationCode] = useState([]);

    const [verificationResendBlocked, setVerificationResendBlocked] = useState(false);
    const [verificationError, setVerificationError] = useState({error: false, message: "", type: ""});
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    useEffect(() => {
      if (user) {
        navigate("/library");
      }else if(!location.state || !location.state.email){
        navigate("/login");
       }else{
        setEmail(location.state.email);
       }
    }, [user, location]); 



    const handleInput = (e) => {
        if (e.target.value.length > 1){
            e.target.value = e.target.value.slice(0, 1);
        }

        if(e.target.id !== "last-verification-input" && e.target.value.length !== 0){
            e.target.nextSibling.focus();
        }
    }

    const handleChange = (e, index) => {
      if(verificationError.error){
        setVerificationError({error: false, message: "", type: ""});
      }
      
      setVerificationCode(prevCode => {
        const updatedCode = [...prevCode];
        updatedCode[index] = e.target.value;
        return updatedCode;
      })
    }

    const handleVerify = async () => {
      try {
        if(verificationError.error){
          setVerificationError({error: false, message: "", type: ""});
        }

        if(verificationCode.length < 6 || verificationCode.some(value => value === undefined || value === "")){
          setVerificationError({error: true, message: "Enter the code", type: "empty-error"});
          return;
        }
        const config = {withCredentials: true};
        const code = verificationCode.join("");

        const res = await confirmPasswordReset({email, code}, config);

        setVerificationSuccess(true);

        setTimeout(() => {
          setVerificationSuccess(false);
          navigate("/reset-password/new", { state: { email } })
        }, 4000);

      } catch (error) {
        if(error.response && error.response.status === 400 && error.response.data.message){
          setVerificationError({error: true, message: error.response.data.message, type: "code-error"})
        }else{
          setVerificationError({error: true, message: "Internal server error", type: "other"})
        }
      }
    }

    //Countdown
    useEffect(() => {
      const savedCountdown = JSON.parse(localStorage.getItem("countdown"));
      if(savedCountdown) {
        setResendCountdown(savedCountdown);
        setVerificationResendBlocked(true);

        
        const interval = setInterval(() => {
          setResendCountdown(prevCountdown => {
            if (prevCountdown <= 1) {
              clearInterval(interval);
              setVerificationResendBlocked(false);
              localStorage.removeItem("countdown");
              return 0;
            }
            return prevCountdown - 1;
          });

          const newCountdown =JSON.parse(localStorage.getItem("countdown")) - 1;
          localStorage.setItem("countdown", newCountdown);
          return newCountdown;
        }, 1000);


        return () => clearInterval(interval); // Clean up

      }

          
    }, [])

    const handleResend = async () => {
      try {
        if(verificationError.error){
          setVerificationError({error: false, message: "", type: ""})
        }

        const config = {withCredentials: true};
        const res = await sendVerificationCode({email: user.email, type: "password-reset"}, config);

        setVerificationResendBlocked(true);
        setResendCountdown(120);
        localStorage.setItem("countdown", 120);

        const interval = setInterval(() => {
          setResendCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(interval);
              setVerificationResendBlocked(false);
              localStorage.removeItem("countdown");
              return 0;
            }
            return prevCountdown - 1;
          });

          const newCountdown =JSON.parse(localStorage.getItem("countdown")) - 1;
          localStorage.setItem("countdown", newCountdown);
          return newCountdown;
        }, 1000);

      } catch (error) {
        setVerificationError({error: true, message: "Couldn't resend a code", type: "other"})
      }
    }

    return (
      <div className="verification">
        <div className="verification-image">
          <img src={verificationImage} alt="postman" />
        </div>
        <h3>Check your email</h3>
        <p>Code has been sent to {email}. Enter below to reset your password</p>
        <div
          className={
            verificationSuccess
              ? "verification-inputs success blink"
              : "verification-inputs"
          }
        >
          <input
            type="number"
            onInput={(e) => {
              handleInput(e);
            }}
            className={
              verificationError.error &&
              verificationError.type == "empty-error" &&
              (verificationCode[0] == undefined || verificationCode[0] == "")
                ? "verification-input error shake"
                : verificationError.error &&
                  verificationError.type == "code-error"
                ? "verification-input error shake"
                : "verification-input"
            }
            onChange={(e) => {
              handleChange(e, 0);
            }}
          />
          <input
            type="number"
            onInput={(e) => {
              handleInput(e);
            }}
            className={
              verificationError.error &&
              verificationError.type == "empty-error" &&
              (verificationCode[1] == undefined || verificationCode[1] == "")
                ? "verification-input error shake"
                : verificationError.error &&
                  verificationError.type == "code-error"
                ? "verification-input error shake"
                : "verification-input"
            }
            onChange={(e) => {
              handleChange(e, 1);
            }}
          />
          <input
            type="number"
            onInput={(e) => {
              handleInput(e);
            }}
            className={
              verificationError.error &&
              verificationError.type == "empty-error" &&
              (verificationCode[2] == undefined || verificationCode[2] == "")
                ? "verification-input error shake"
                : verificationError.error &&
                  verificationError.type == "code-error"
                ? "verification-input error shake"
                : "verification-input"
            }
            onChange={(e) => {
              handleChange(e, 2);
            }}
          />
          <input
            type="number"
            onInput={(e) => {
              handleInput(e);
            }}
            className={
              verificationError.error &&
              verificationError.type == "empty-error" &&
              (verificationCode[3] == undefined || verificationCode[3] == "")
                ? "verification-input error shake"
                : verificationError.error &&
                  verificationError.type == "code-error"
                ? "verification-input error shake"
                : "verification-input"
            }
            onChange={(e) => {
              handleChange(e, 3);
            }}
          />
          <input
            type="number"
            onInput={(e) => {
              handleInput(e);
            }}
            className={
              verificationError.error &&
              verificationError.type == "empty-error" &&
              (verificationCode[4] == undefined || verificationCode[4] == "")
                ? "verification-input error shake"
                : verificationError.error &&
                  verificationError.type == "code-error"
                ? "verification-input error shake"
                : "verification-input"
            }
            onChange={(e) => {
              handleChange(e, 4);
            }}
          />
          <input
            type="number"
            onInput={(e) => {
              handleInput(e);
            }}
            className={
              verificationError.error &&
              verificationError.type == "empty-error" &&
              (verificationCode[5] == undefined || verificationCode[5] == "")
                ? "verification-input error shake"
                : verificationError.error &&
                  verificationError.type == "code-error"
                ? "verification-input error shake"
                : "verification-input"
            }
            id="last-verification-input"
            onChange={(e) => {
              handleChange(e, 5);
            }}
          />
        </div>

        <div className="verification-resend">
          <span>Never got a code?</span>{" "}
          <button disabled={verificationResendBlocked} onClick={handleResend}>
            Resend
          </button>
          {verificationResendBlocked && (
            <div className="verification-resend-timer">
              You can try again in{" "}
              <span className="time">
                {Math.floor(resendCountdown / 60)}:
                {String(resendCountdown % 60).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        {verificationError.error && (
          <span className="verification-error">
            {verificationError.message}
          </span>
        )}

        <button
          className="verification-verify-button button"
          onClick={handleVerify}
        >
          Continue
        </button>
      </div>
    );
}

export default ResetPasswordVerification;
