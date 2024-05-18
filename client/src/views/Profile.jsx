import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { changeUserAvatar, changeUserPassword, getAvatars, updateUserCountry } from "../api";
import { useFormik } from "formik";
import { userInfoSchema } from "../schemas";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [flag, setFlag] = useState({ src: "", alt: "" });
  const [countries, setCountries] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [userAvatarPath, setUserAvatarPath] = useState("");

  const [submitError, setSubmitError] = useState({ error: false, message: "" });

  const [currentPasswordRequiredError, setCurrentPasswordRequiredError] = useState(false);
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [passwordConfirmationequiredError,setPasswordConfirmationRequiredError] = useState(false);
  const [passwordUpdatedMessageVisible, setPasswordUpdatedMessageVisible] = useState(false);

  const [avatarsFormVisible, setAvatarsFormVisible] = useState(false);
  const avatarsFormRef = useRef(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  //Fetch flags and avatars
  useEffect(() => {
    const fetchData = async () => {
      const resFlags = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
      );
      const resAvatars = await getAvatars();

      //Set avatars
      setAvatars(resAvatars.data.avatars);
      const userAvatar = resAvatars.data.avatars.find(avatar => avatar.avatarId === user.avatarId);
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
      if(user.avatarId != selectedAvatarId){
        const config = {withCredentials: true};
        const res = await changeUserAvatar({avatarId: selectedAvatarId}, config, user.userId)

        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setAvatarsFormVisible(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

   //Restrict screen height when overlay is visible
   useEffect(() => {
    const handleBodyStyles = () => {
      if (avatarsFormVisible) {
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
  }, [avatarsFormVisible]);

  //Hide popup-form/dropdown-menu when clicked elsewhere
  useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          avatarsFormRef.current !== null &&
          !avatarsFormRef.current.contains(event.target)
        ) {
          setAvatarsFormVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);


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
                    onClick={()=> {setSelectedAvatarId(avatar.avatarId)}}
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
            >
              Delete my account
            </button>
          </form>
        </>
      )}

      <div
        id="overlay"
        style={avatarsFormVisible ? { display: "block" } : { display: "none" }}
      ></div>
    </div>
  );
}

export default Profile;