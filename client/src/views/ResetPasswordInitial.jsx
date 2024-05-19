import { useContext, useEffect, useState } from "react";
import {AuthContext} from "../context/AuthContext"
import verificationImage from "../assets/verification-bg.svg"
import { useNavigate } from "react-router-dom";
import { resendVerificationCode, verifyAccount } from "../api";

const ResetPasswordInitial = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate("/library");
      }
    }, [user]);  

    //formik: email
    //send req, send verificationCode => redirect => enter verification code => changePassword


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
        const res = await resendVerificationCode({}, config);

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
        {user && (
          <>
            <div className="verification-image">
              <img src={verificationImage} alt="postman" />
            </div>
            <h3>Check your email</h3>
            <p>
              Code has been sent to {user.email}. Enter below to verify account
            </p>
            <div className={verificationSuccess ? "verification-inputs success blink" : "verification-inputs"}>
              <input
                type="number"
                onInput={(e) => {
                  handleInput(e);
                }}
                className={
                  verificationError.error && verificationError.type=="empty-error" &&
                  (verificationCode[0] == undefined ||
                    verificationCode[0] == "")
                    ? "verification-input error shake"
                    : (verificationError.error && verificationError.type=="code-error" ? "verification-input error shake" :  "verification-input")
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
                  verificationError.error && verificationError.type=="empty-error" && 
                  (verificationCode[1] == undefined ||
                    verificationCode[1] == "")
                    ? "verification-input error shake"
                    : (verificationError.error && verificationError.type=="code-error" ? "verification-input error shake" :  "verification-input")
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
                  verificationError.error && verificationError.type=="empty-error" &&
                  (verificationCode[2] == undefined ||
                    verificationCode[2] == "")
                    ? "verification-input error shake"
                    : (verificationError.error && verificationError.type=="code-error" ? "verification-input error shake" :  "verification-input")
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
                  verificationError.error && verificationError.type=="empty-error" &&
                  (verificationCode[3] == undefined ||
                    verificationCode[3] == "")
                    ? "verification-input error shake"
                    : (verificationError.error && verificationError.type=="code-error" ? "verification-input error shake" :  "verification-input")
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
                  verificationError.error && verificationError.type=="empty-error" &&
                  (verificationCode[4] == undefined ||
                    verificationCode[4] == "")
                    ? "verification-input error shake"
                    : (verificationError.error && verificationError.type=="code-error" ? "verification-input error shake" :  "verification-input")
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
                  verificationError.error && verificationError.type=="empty-error" &&
                  (verificationCode[5] == undefined ||
                    verificationCode[5] == "")
                    ? "verification-input error shake"
                    : (verificationError.error && verificationError.type=="code-error" ? "verification-input error shake" :  "verification-input")
                }
                id="last-verification-input"
                onChange={(e) => {
                  handleChange(e, 5);
                }}
              />
            </div>

            <div className="verification-resend">
              <span>Never got a code?</span> <button disabled={verificationResendBlocked} onClick={handleResend}>Resend</button> 
              {verificationResendBlocked && (
              <div className="verification-resend-timer">
                You can try again in <span className="time">{Math.floor(resendCountdown / 60)}:{String(resendCountdown % 60).padStart(2, '0')}</span>
              </div>
              )}
            </div>
          

            {verificationError.error && (
              <span className="verification-error">{verificationError.message}</span>
            )}

            <button
              className="verification-verify-button button"
              onClick={handleVerify}
            >
              Verify
            </button>
          </>
        )}
      </div>
    );
}

export default ResetPasswordVerification;
