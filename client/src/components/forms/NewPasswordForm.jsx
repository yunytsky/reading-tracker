import { restorePasswordSchema } from "../../schemas";
import {useFormik} from "formik";
import {  useState } from "react";
import {  useNavigate } from "react-router-dom";

const NewPasswordForm = () => {
    const [submitError, setSubmitError] = useState({error: false, message: ""});
    const [passwordUpdatedMessageVisible, setPasswordUpdatedMessageVisible] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
      try {        
        if(submitError){
          setSubmitError({error: false, message: ""});
        }


        const config = {withCredentials: true}
       

      } catch (error) {
        if(error.response && error.response.status == 400 && error.response.data.message){
          setSubmitError({error: true, message: error.response.data.message})
        }else{
          
          setSubmitError({error: true, message: "Error"})
        }
      }
    }

    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirmation: ""
        },
        validationSchema: restorePasswordSchema,
        onSubmit: onSubmit,
    });

    return (
      <form onSubmit={formik.handleSubmit} className="login-form">
        {/* Password */}
        <label className="profile-input-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          className="profile-input"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={(e) => {
            formik.handleChange(e);
            setPasswordRequiredError(false);
          }}
        />

        {formik.errors.password && formik.touched.password && (
          <span className="profile-info-error">{formik.errors.password}</span>
        )}

        {/* Password confirmation */}
        <label className="profile-input-label" htmlFor="passwordConfirmation">
          Password confirmation
        </label>
        <input
          type="password"
          className="profile-input"
          name="passwordConfirmation"
          id="passwordConfirmation"
          value={formik.values.passwordConfirmation}
          onChange={(e) => {
            formik.handleChange(e);
            setPasswordConfirmationRequiredError(false);
          }}
        />

        {formik.errors.passwordConfirmation &&
          formik.touched.passwordConfirmation && (
            <span className="profile-info-error">
              {formik.errors.passwordConfirmation}
            </span>
          )}


        {/* Password successfully updated message*/}
        {passwordUpdatedMessageVisible && (
          <span className="profile-info-password-updated-message">
            ✔ Password successfully updated
          </span>
        )}

        {/* Save button */}
        <button className="profile-save-button button" type="submit">
          Save
        </button>

        {/* Submit error */}
        {submitError.error && (
          <span className="profile-info-submit-error">
            {submitError.message}
          </span>
        )}
      </form>
    );
};

export default NewPasswordForm; 
