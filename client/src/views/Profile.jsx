import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  changeUserAvatar,
  changeUserEmail,
  changeUserPassword,
  deleteAccount,
  getAvatars,
  sendVerificationCode,
  updateUserCountry,
} from "../api";
import { useFormik } from "formik";
import { passwordSchema, userInfoSchema } from "../schemas";
import DeleteWarning from "../components/DeleteWarning";
import verificationImage from "../assets/verification-bg.svg";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [flag, setFlag] = useState({ src: "", alt: "" });
  const [countries, setCountries] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [userAvatarPath, setUserAvatarPath] = useState("");

  const [submitError, setSubmitError] = useState({ error: false, message: "" });

  const [currentPasswordRequiredError, setCurrentPasswordRequiredError] =
    useState(false);
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [
    passwordConfirmationequiredError,
    setPasswordConfirmationRequiredError,
  ] = useState(false);
  const [passwordUpdatedMessageVisible, setPasswordUpdatedMessageVisible] =
    useState(false);

  const [avatarsFormVisible, setAvatarsFormVisible] = useState(false);
  const avatarsFormRef = useRef(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  const [deleteAccountFormVisible, setDeleteAccountFormVisible] =
    useState(false);
  const [
    deleteAccountConfirmationVisible,
    setDeleteAccountConfirmationVisible,
  ] = useState(false);
  const [deleteAccountFormError, setDeleteAccountFormError] = useState({
    error: false,
    message: "",
  });
  const deleteAccountFormRef = useRef(null);
  const deleteAccountConfirmationRef = useRef(null);

  const [verifyEmailChangeFormVisible, setVerifyEmailChangeFormVisible] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState([]);
  const [verificationResendBlocked, setVerificationResendBlocked] =
    useState(false);
  const [verificationError, setVerificationError] = useState({
    error: false,
    message: "",
    type: "",
  });
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  //Fetch flags and avatars
  useEffect(() => {
    const fetchData = async () => {
      const resFlags = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
      );
      const resAvatars = await getAvatars();

      //Set avatars
      setAvatars(resAvatars.data.avatars);
      const userAvatar = resAvatars.data.avatars.find(
        (avatar) => avatar.avatarId === user.avatarId
      );
      setUserAvatarPath(userAvatar.path);
      setSelectedAvatarId(userAvatar.avatarId);

      //Set flags, countries
      setFlag({
        src: resFlags.data[user.country].flags.svg,
        alt: resFlags.data[user.country].cca2,
      });
      const countries = resFlags.data.map((country, index) => {
        return { name: country.name.common, code: index };
      });

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
    };

    fetchData();
  }, [user]);

  const handleInput = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1);
    }

    if (
      e.target.id !== "last-verification-input" &&
      e.target.value.length !== 0
    ) {
      e.target.nextSibling.focus();
    }
  };

  const handleChange = (e, index) => {
    if (verificationError.error) {
      setVerificationError({ error: false, message: "", type: "" });
    }

    setVerificationCode((prevCode) => {
      const updatedCode = [...prevCode];
      updatedCode[index] = e.target.value;
      return updatedCode;
    });
  };

  const handleVerify = async () => {
    try {
      if (verificationError.error) {
        setVerificationError({ error: false, message: "", type: "" });
      }

      if (
        verificationCode.length < 6 ||
        verificationCode.some((value) => value === undefined || value === "")
      ) {
        setVerificationError({
          error: true,
          message: "Enter the code",
          type: "empty-error",
        });
        return;
      }
      const config = { withCredentials: true };
      const code = verificationCode.join("");
      const res = await changeUserEmail({ email: formik.values.email, code }, config);

      setVerificationSuccess(true);

      setTimeout(() => {
        setVerificationSuccess(false);
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setVerificationCode([]);
        setVerifyEmailChangeFormVisible(false);
      }, 4000);


    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message
      ) {
        setVerificationError({
          error: true,
          message: error.response.data.message,
          type: "code-error",
        });
      } else {
        console.log(error)
        setVerificationError({
          error: true,
          message: "Internal server error",
          type: "other",
        });
      }
    }
  };

  //Countdown
  useEffect(() => {
    const savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    if (savedCountdown) {
      setResendCountdown(savedCountdown);
      setVerificationResendBlocked(true);

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

        const newCountdown = JSON.parse(localStorage.getItem("countdown")) - 1;
        localStorage.setItem("countdown", newCountdown);
        return newCountdown;
      }, 1000);

      return () => clearInterval(interval); // Clean up
    }
  }, []);

  const handleResend = async () => {
    try {
      if (verificationError.error) {
        setVerificationError({ error: false, message: "", type: "" });
      }

      const config = { withCredentials: true };
      const res = await sendVerificationCode(
        { email: user.email, type: "account-verification" },
        config
      );

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

        const newCountdown = JSON.parse(localStorage.getItem("countdown")) - 1;
        localStorage.setItem("countdown", newCountdown);
        return newCountdown;
      }, 1000);
    } catch (error) {
      setVerificationError({
        error: true,
        message: "Couldn't resend a code",
        type: "other",
      });
    }
  };

  const onSubmit = async (values, actions) => {
    try {
      if (submitError) {
        setSubmitError({ error: false, message: "" });
      }

      const config = { withCredentials: true };

      //Update password
      if (
        values.currentPassword !== "" ||
        values.password !== "" ||
        values.passwordConfirmation !== ""
      ) {
        let hasError = false;

        if (values.currentPassword === "") {
          setCurrentPasswordRequiredError(true);
          hasError = true;
        }

        if (values.password === "") {
          setPasswordRequiredError(true);
          hasError = true;
        }

        if (values.passwordConfirmation === "") {
          setPasswordConfirmationRequiredError(true);
          hasError = true;
        }

        if (hasError) {
          return;
        } else {
          const res = await changeUserPassword(
            {
              currentPassword: values.currentPassword,
              password: values.password,
            },
            config
          );

          setPasswordUpdatedMessageVisible(true);
          setTimeout(() => {
            setPasswordUpdatedMessageVisible(false);
          }, 5000);

          values.password = "";
          values.currentPassword = "";
          values.passwordConfirmation = "";
        }
      }

      //Update country
      if (user.country != values.country) {
        const res = await updateUserCountry(
          { country: values.country },
          config,
          user.userId
        );
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      }

      //Update email
      if (user.email != values.email) {
        const res = await sendVerificationCode(
          { email: values.email, type: "email-change" },
          config
        );

        setVerifyEmailChangeFormVisible(true);
      }

      //Update email
    } catch (error) {
      if (error.response && error.response.data.message) {
        setSubmitError({ error: true, message: error.response.data.message });
      } else {
        setSubmitError({ error: true, message: "Error" });
      }
    }
  };

  const handleChangeAvatar = async () => {
    try {
      if (user.avatarId != selectedAvatarId) {
        const config = { withCredentials: true };
        const res = await changeUserAvatar(
          { avatarId: selectedAvatarId },
          config,
          user.userId
        );

        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setAvatarsFormVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Restrict screen height when overlay is visible
  useEffect(() => {
    const handleBodyStyles = () => {
      if (
        avatarsFormVisible ||
        deleteAccountConfirmationVisible ||
        deleteAccountFormVisible ||
        verifyEmailChangeFormVisible
      ) {
        window.scrollTo(0, 0);
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
      }
    };

    handleBodyStyles();
    return () => {
      // Clean up
      document.body.style.height = "auto";
      document.body.style.overflow = "visible";
    };
  }, [
    avatarsFormVisible,
    deleteAccountConfirmationVisible,
    deleteAccountFormVisible,
    verifyEmailChangeFormVisible,
  ]);

  //Hide popup-form/dropdown-menu when clicked elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarsFormRef.current !== null &&
        !avatarsFormRef.current.contains(event.target)
      ) {
        setAvatarsFormVisible(false);
      }

      if (
        deleteAccountConfirmationRef.current !== null &&
        !deleteAccountConfirmationRef.current.contains(event.target)
      ) {
        setDeleteAccountConfirmationVisible(false);
      }

      if (
        deleteAccountFormRef.current !== null &&
        !deleteAccountFormRef.current.contains(event.target)
      ) {
        formikDeleteAccount.resetForm();
        setDeleteAccountFormVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteAccount = async (values, actions) => {
    try {
      if (deleteAccountFormError.error) {
        setDeleteAccountFormError({ error: false, message: "" });
      }

      const config = { withCredentials: true };
      const res = await deleteAccount({ password: values.password }, config);

      actions.resetForm();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      if (
        error.response &&
        error.response.status == 400 &&
        error.response.data.message
      ) {
        setDeleteAccountFormError({
          error: true,
          message: error.response.data.message,
        });
      } else {
        setDeleteAccountFormError({
          error: true,
          message: "Internal server error, try again later",
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      country: user.country,
      email: user.email,
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: userInfoSchema,
    onSubmit: onSubmit,
  });

  const formikDeleteAccount = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: passwordSchema,
    onSubmit: handleDeleteAccount,
  });

  return (
    <div className="profile">
      {user && (
        <>
          <div
            className="profile-avatar"
            onClick={() => {
              setAvatarsFormVisible(true);
            }}
          >
            <img
              src={`http://localhost:3000/img/avatars/${userAvatarPath}`}
              alt="avatar"
              className="avatar"
            />
          </div>
          {avatarsFormVisible && (
            <div className="profile-avatars-form" ref={avatarsFormRef}>
              <h5>Choose avatar</h5>
              <div className="profile-avatars-form-avatars">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    className={
                      avatar.avatarId == selectedAvatarId
                        ? "avatar selected"
                        : "avatar"
                    }
                    src={`http://localhost:3000/img/avatars/${avatar.path}`}
                    alt={avatar.path}
                    onClick={() => {
                      setSelectedAvatarId(avatar.avatarId);
                    }}
                  />
                ))}
              </div>
              {/*Buttons*/}
              <div className="profile-avatars-form-buttons">
                <button
                  type="button"
                  className="button empty"
                  onClick={() => {
                    setAvatarsFormVisible((prevVisible) => !prevVisible);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button"
                  onClick={(e) => {
                    handleChangeAvatar(e);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          <h3 className="profile-user">
            <span className="username">{user.username}</span>{" "}
            <img className="flag" src={flag.src} alt={flag.alt} />
          </h3>
          <form className="profile-info" onSubmit={formik.handleSubmit}>
            <h5>Account information</h5>
            {/* Country */}
            <label className="profile-input-label" htmlFor="country">
              Country
            </label>
            <select
              className="profile-select"
              name="country"
              id="country"
              value={formik.values.country}
              onChange={formik.handleChange}
            >
              <option value=""></option>
              {countries.map((country, index) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            {formik.errors.country && formik.touched.country && (
              <span className="profile-info-error">
                {formik.errors.country}
              </span>
            )}

            {/* Email */}
            <label className="profile-input-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="profile-input"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />

            {formik.errors.email && formik.touched.email && (
              <span className="profile-info-error">{formik.errors.email}</span>
            )}

            {/* Current password */}
            <label className="profile-input-label" htmlFor="currentPassword">
              Current password
            </label>
            <input
              type="password"
              className="profile-input"
              name="currentPassword"
              id="currentPassword"
              value={formik.values.currentPassword}
              onChange={(e) => {
                formik.handleChange(e);
                setCurrentPasswordRequiredError(false);
              }}
            />

            {formik.errors.currentPassword &&
              formik.touched.currentPassword && (
                <span className="profile-info-error">
                  {formik.errors.currentPassword}
                </span>
              )}

            {currentPasswordRequiredError && (
              <span className="profile-info-error">Required</span>
            )}

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
              <span className="profile-info-error">
                {formik.errors.password}
              </span>
            )}

            {passwordRequiredError && (
              <span className="profile-info-error">Required</span>
            )}

            {/* Password confirmation */}
            <label
              className="profile-input-label"
              htmlFor="passwordConfirmation"
            >
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

            {passwordConfirmationequiredError && (
              <span className="profile-info-error">Required</span>
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

            {/* dividor */}
            <span className="divider"></span>
            {/* Delete account button */}
            <button
              className="profile-delete-button delete-button"
              type="button"
              onClick={() => {
                setDeleteAccountConfirmationVisible(true);
              }}
            >
              Delete my account
            </button>
          </form>

          {verifyEmailChangeFormVisible && (
            <div className="verify-email-change-form">
              <div className="verification-image">
                <img src={verificationImage} alt="postman" />
              </div>
              <h4>Check your email</h4>
              <p>
                Code has been sent to {formik.values.email}. Enter below to change your
                password. In case code is not entered, changes will not be
                applied
              </p>
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
                    (verificationCode[0] == undefined ||
                      verificationCode[0] == "")
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
                    (verificationCode[1] == undefined ||
                      verificationCode[1] == "")
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
                    (verificationCode[2] == undefined ||
                      verificationCode[2] == "")
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
                    (verificationCode[3] == undefined ||
                      verificationCode[3] == "")
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
                    (verificationCode[4] == undefined ||
                      verificationCode[4] == "")
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
                    (verificationCode[5] == undefined ||
                      verificationCode[5] == "")
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
                <button
                  disabled={verificationResendBlocked}
                  onClick={handleResend}
                >
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

              <div className="verification-buttons">
                <button
                  className="verification-cancel-button button empty"
                  onClick={() => {setVerifyEmailChangeFormVisible(false); if(verificationError){setVerificationError({error: false, message: "", type: ""})}}}
                >
                  Cancel
                </button>
                <button
                  className="verification-verify-button button"
                  onClick={handleVerify}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {deleteAccountFormVisible && (
            <form
              className="delete-account-form"
              ref={deleteAccountFormRef}
              onSubmit={formikDeleteAccount.handleSubmit}
            >
              <h5>Enter your password to proceed</h5>
              {/* Password */}
              <div className="delete-account-form-input-wrapper">
                <label
                  className="delete-account-form-label form-label"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  onInput={() => {
                    if (deleteAccountFormError) {
                      setDeleteAccountFormError({ error: false, message: "" });
                    }
                  }}
                  onChange={formikDeleteAccount.handleChange}
                  value={formikDeleteAccount.values.password}
                />

                {/* Password error */}
                {formikDeleteAccount.errors.password &&
                  formikDeleteAccount.touched.password && (
                    <span className="profile-info-error">
                      {formikDeleteAccount.errors.password}
                    </span>
                  )}

                {deleteAccountFormError.error && (
                  <div className="delete-account-form-error">
                    {deleteAccountFormError.message}
                  </div>
                )}
              </div>

              <p>
                This action is irreversible, you cannot restore your account
                once you clicked Delete button
              </p>

              <div className="delete-account-form-buttons">
                <button
                  type="button"
                  className="button empty"
                  onClick={() => {
                    setDeleteAccountFormVisible(false);
                    formikDeleteAccount.resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="button red">
                  Delete
                </button>
              </div>
            </form>
          )}

          {deleteAccountConfirmationVisible && (
            <DeleteWarning
              message={
                "Do you really want to delete your account? This action cannot be undone"
              }
              onDelete={() => {
                setDeleteAccountConfirmationVisible(false);
                setDeleteAccountFormVisible(true);
              }}
              onCancel={() => {
                setDeleteAccountConfirmationVisible(false);
              }}
              ref={deleteAccountConfirmationRef}
            />
          )}
        </>
      )}

      <div
        id="overlay"
        style={
          avatarsFormVisible ||
          deleteAccountFormVisible ||
          deleteAccountConfirmationVisible ||
          verifyEmailChangeFormVisible
            ? { display: "block" }
            : { display: "none" }
        }
      ></div>
    </div>
  );
};

export default Profile;
