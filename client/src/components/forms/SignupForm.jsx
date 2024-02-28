import { signupSchema } from "../../schemas";
import {useFormik} from "formik";
import { Link } from "react-router-dom";

const SignupForm = () => {
    const onSubmit = () => {
        console.log("signup req")
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            passwordConfirmation: ""
        },
        validationSchema: signupSchema,
        onSubmit: onSubmit,
    });

    return (
      <form onSubmit={formik.handleSubmit} className="signup-form">

        {/* Email */}
        <label className="form-label" htmlFor="email">Email</label>
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

        {/* Username */}
        <label className="form-label" htmlFor="username">Username</label>
        <input
          type="text"
          className="form-input"
          name="username"
          id="username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />

        {formik.errors.username && formik.touched.username && (
          <span className="form-error">{formik.errors.username}</span>
        )}

        {/* Password */}
        <label className="form-label" htmlFor="password">Password</label>
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
        <label className="form-label" htmlFor="password-confirmation">Password confirmation</label>
        <input
          type="password"
          className="form-input"
          name="password-confirmation"
          id="password-confirmation"
          value={formik.values.passwordConfirmation}
          onChange={formik.handleChange}
        />

        {formik.errors.passwordConfirmation && formik.touched.passwordConfirmation && (
          <span className="form-error">{formik.errors.passwordConfirmation}</span>
        )}

        {/* Submit button */}
        <button type="submit" className="button">
          Sign up
        </button>

        {/* Submit error */}
        {/* submit err */}

        {/* Auxiliary link */}
        <span className="form-auxiliary-link">
          Already have an account?
          <Link to="/login"> Log in</Link>
        </span>
      </form>
    );
};

export default SignupForm;