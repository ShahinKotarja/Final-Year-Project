import React, { useState } from "react";
import { Logo, Breadcrumb, Card } from "../../components/index";
import styles from "./Auth.module.scss";
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slice/authSlice";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { images } from "../../constants/index";
import { Checkbox, Label } from "theme-ui";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();

    setIsLoading(true);

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        toast.success("Welcome back!");
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        toast.error(error.message || "Failed to sign in. Please try again.");
        setIsLoading(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className={`${styles.auth_container}`}>
      <Breadcrumb items={[{ label: "Sign in", path: "/login" }]} />

      <div
        className={`${styles.auth_content} w-100 d-flex justify-content-center align-items-center flex-column`}
      >
        <div className={`${styles.auth_header} d-flex`}>
          <h4>Sign in to your account</h4>
          <h6>
            New customer?
            <span>
              <Link to="/register">Create an account</Link>
            </span>
          </h6>
        </div>
        <Card cardClass={styles.auth_card}>
          <div
            className={`${styles.auth_form_container} w-100 d-flex justify-content-center align-items-center`}
          >
            <form onSubmit={handleSignIn} className={`${styles.auth_form}`}>
              <label htmlFor="email">Email Address</label>
              <input
                className={`${styles.normal_input}`}
                type="email"
                id="email"
                placeholder="e.g. name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <div className={`${styles.input_password} d-flex`}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Insert password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`${styles.password_toggle}`}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className={`${styles.login_checkbox}`}>
                <Label
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Checkbox
                    defaultChecked={false}
                    sx={{
                      border: "1px solid #808080",
                      width: "25px",
                      height: "25px",
                      "&:active": {
                        outline: "none",
                        boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                      },
                      "&:focus": {
                        outline: "none", // Removing the default focus outline
                        boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)", // Custom focus style
                      },
                      "&:focus-visible": {
                        outline: "none",
                        boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)", // Ensuring custom focus style for keyboard navigation
                      },
                    }}
                  />{" "}
                  Keep me signed in
                </Label>
                {/* <label htmlFor="keepSignedIn">Keep me signed in</label> */}
              </div>

              <a href="#" className={`${styles.forgot_password}`}>
                Forgot password?
              </a>

              {isLoading ? (
                <div className={styles.classic_spinner}>
                  <img
                    src={images.classic_spinner}
                    alt="loading, please wait..."
                  />
                </div>
              ) : (
                <button className={`btn-1`} type="submit">
                  Sign in
                </button>
              )}
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Login;
