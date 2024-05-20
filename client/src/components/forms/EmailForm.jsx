import {useFormik} from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailSchema } from "../../schemas";
import { checkIfEmailTaken, sendVerificationCode } from "../../api";

const EmailForm = () => {
    const [submitError, setSubmitError] = useState({error: false, message: ""});

    const navigate = useNavigate();
 
    const onSubmit = async (values, actions) => {
        try {        
            const config = {withCredentials: true};
            const takenRes = await checkIfEmailTaken(values.email, {});
            if(takenRes.data.taken){
              const res = await sendVerificationCode({email: values.email, type: "password-reset"}, config);
              navigate("/reset-password-verification", { state: { email: values.email } })
              actions.resetForm();
  
            }else{
              setSubmitError({error: true, message: "No user with this email was found"})
            }
           

        } catch (error) {
            setSubmitError({error: true, message: "Couldn't send a verification code, try later"})
        }
      }
  
      const formik = useFormik({
          initialValues: {
              email: ""
          },
          validationSchema: emailSchema,
          onSubmit: onSubmit,
      });

    return (
      <form onSubmit={formik.handleSubmit} className="login-form">
        {/* Email */}
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          className="form-input"
          name="email"
          id="email"
          value={formik.values.email}
          onChange={(e) => {formik.handleChange(e); if(submitError){setSubmitError({error: false, message: ""})}}}
        />

        {formik.errors.email && formik.touched.email && (
          <span className="form-error">{formik.errors.email}</span>
        )}

        {/* Submit button */}
        <button type="submit" className="button">
          Continue
        </button>

        {/* Submit error */}
        {submitError.error && (
          <span className="form-submit-error">{submitError.message}</span>
        )}

      </form>
    );
};

export default EmailForm;