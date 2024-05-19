import { restorePasswordSchema } from "../../schemas";
import {useFormik} from "formik";
import {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import { resetPassword } from "../../api";

const NewPasswordForm = ({email}) => {
    const [submitError, setSubmitError] = useState({error: false, message: ""});
    const [passwordUpdatedMessageVisible, setPasswordUpdatedMessageVisible] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (values, actions) => {
      try {        
        if(submitError){
          setSubmitError({error: false, message: ""});
        }

        const config = {withCredentials: true}
        const res = await resetPassword({...values, email}, config);
        setPasswordUpdatedMessageVisible(true);

        
        setTimeout(() => {
          setPasswordUpdatedMessageVisible(false);
          actions.resetForm();
          navigate("/login");
        }, 3000);
       
      } catch (error) {
        if(error.response && error.response.status == 400 || error.response.status == 403 && error.response.data.message){
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
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          className="form-input"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />

        {formik.errors.password && formik.touched.password && (
          <span className="form-error">{formik.errors.password}</span>
        )}

        {/* Password confirmation */}
        <label className="form-label" htmlFor="passwordConfirmation">
          Password confirmation
        </label>
        <input
          type="password"
          className="form-input"
          name="passwordConfirmation"
          id="passwordConfirmation"
          value={formik.values.passwordConfirmation}
          onChange={formik.handleChange}
        />

        {formik.errors.passwordConfirmation &&
          formik.touched.passwordConfirmation && (
            <span className="form-error">
              {formik.errors.passwordConfirmation}
            </span>
          )}


        {/* Password successfully updated message*/}
        {passwordUpdatedMessageVisible && (
          <span className="new-password-form-updated-message">
            ✔ Password successfully updated
          </span>
        )}

        {/* Save button */}
        <button className="new-password-form-button button" type="submit">
          Save
        </button>

        {/* Submit error */}
        {submitError.error && (
          <span className="form-submit-error">
            {submitError.message}
          </span>
        )}
      </form>
    );
};

export default NewPasswordForm; 
