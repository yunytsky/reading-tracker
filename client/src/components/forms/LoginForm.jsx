import { loginSchema } from "../../schemas";
import {useFormik} from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../api";

const LoginForm = () => {
    const [submitError, setSubmitError] = useState({error: false, message: ""});

    const onSubmit = async (values, actions) => {
      try {        
        if(submitError){
          setSubmitError({error: false, message: ""});
        }

        const data = await login(values);
        actions.resetForm();

        //navigate to the app
      } catch (error) {
        if(error.response.data.message){
          setSubmitError({error: true, message: error.response.data.message})
        }else{
          setSubmitError({error: true, message: "Error"})
        }
      }
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: loginSchema,
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
          onChange={formik.handleChange}
        />

        {formik.errors.email && formik.touched.email && (
          <span className="form-error">{formik.errors.email}</span>
        )}

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

        {/* Submit button */}
        <button type="submit" className="button">
          Log in
        </button>

        {/* Submit error */}
        {submitError.error && <span className="form-submit-error">{submitError.message}</span>}


        {/* Auxiliary link */}
        <span className="form-auxiliary-link">
          Don't have an account yet?
          <Link to="/signup"> Sign up</Link>
        </span>
        
      </form>
    );
};

export default LoginForm;