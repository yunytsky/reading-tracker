import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

export const signupSchema = yup.object().shape({
  email: yup.string().email().required("Required"),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]*$/, "Username can only contain letters, digits, and underscores")
    .min(3, "Usrename must contain at least 3 characters")
    .max(15, "Username can't have more than 15 characters"),
  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least 1 small letter")
    .matches(/\d/, "Password mut contain at least 1 digit")
    .matches(/[A-Z]/, "Password must contain at least 1 capital letter")
    .required("Required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match"),
});
