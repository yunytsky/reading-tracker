import { signupSchema } from "../../schemas";
import {useFormik} from "formik";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const {setUser} = useContext(AuthContext);

  const [submitError, setSubmitError] = useState({error: false, message: ""});
  const [countries, setCountries] = useState([]);

  // Fetch countries
    useEffect(() => {
      const fetchData = async () => {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name,flags");
        const countries = res.data.map((country, index) => {return({name: country.name.common, code: index})})

        countries.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase(); 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          return 0;
        });

        setCountries(countries);
      }

      fetchData();
    }, [])

    const onSubmit = async (values, actions) => {
        try {
          if(submitError){
            setSubmitError({error: false, message: ""});
          }

          const config = {withCredentials: true}
          const res = await signup(values, config);
          
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setUser(res.data.user);
          
          actions.resetForm();
          navigate("/account-verification");

        } catch (error) {
          
          if(error.response && error.response.data.message){
            setSubmitError({error: true, message: error.response.data.message})
          }else{
            setSubmitError({error: true, message: "Error"})
          }
        }
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            country: "",
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

        {/* Country */}
        <label className="form-label" htmlFor="country">Country</label>
        <select className="form-select" name="country" id="country" onChange={formik.handleChange} value={formik.values.country}>
          <option value=""></option>
          {countries.map((country, index) => (<option key={country.code} value={country.code}>{country.name}</option>))}
        </select>

        {formik.errors.country && formik.touched.country && (
          <span className="form-error">{formik.errors.country}</span>
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
        <label className="form-label" htmlFor="passwordConfirmation">Password confirmation</label>
        <input
          type="password"
          className="form-input"
          name="passwordConfirmation"
          id="passwordConfirmation"
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
        {submitError.error && <span className="form-submit-error">{submitError.message}</span>}

        {/* Auxiliary link */}
        <span className="form-auxiliary-link">
          Already have an account?
          <Link to="/login"> Log in</Link>
        </span>
      </form>
    );
};

export default SignupForm;