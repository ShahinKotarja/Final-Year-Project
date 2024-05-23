import React, { useState } from "react";
import { Logo, Breadcrumb, Card } from "../../components/index";
import styles from "./Auth.module.scss";
import { FaAngleLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slice/authSlice";
import { Checkbox, Label } from "theme-ui";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "Will",
    lastName: "Smith",
    phone: "07712318912",
    address: "123 Main St",
    postCode: "W12 1RT",
    city: "London",
    country: "United Kingdom",
    hasDiabetes: false,
    hasHeartDisease: false,
    hasHypertension: false,
    hasCeliacDisease: false,
    isAllergic: false,
    diabetesType: "",
    followGlutanFree: false,
    followVegan: false,
    followVegetarian: false,
    followDairyFree: false,
    followKeto: false,
    followPaleo: false,
    followMediterranean: false,
    followHalal: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    // For checkboxes, use the 'checked' property. Otherwise, use 'value'.
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateStep1 = () => {
    const requiredFields = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phone",
      "address",
      "postCode",
      "city",
      "country",
    ];
    return requiredFields.every((field) => Boolean(formData[field]));
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        // Inform the user that all fields must be filled. Adjust the method of notification as needed.
        toast.error("Please fill in all required fields before proceeding.");
        return;
      }
    }

    setCurrentStep(currentStep + 1); // Proceed to the next step if validation passes
  };

  const goPreviousStep = () => {
    setCurrentStep(currentStep - 1); // Proceed to the next step if validation passes
  };

  const handleRegistration = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data for registration
    const userData = {
      email: formData.email,
      password: formData.password,
      additionalData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        postCode: formData.postCode,
        city: formData.city,
        country: formData.country,
        hasDiabetes: formData.hasDiabetes,
        hasHeartDisease: formData.hasHeartDisease,
        hasHypertension: formData.hasHypertension,
        hasCeliacDisease: formData.hasCeliacDisease,
        isAllergic: formData.isAllergic,
        diabetesType: formData.diabetesType,
        followGlutanFree: formData.followGlutanFree,
        followDairyFree: formData.followDairyFree,
        followKeto: formData.followKeto,
        followPaleo: formData.followPaleo,
        followMediterranean: formData.followMediterranean,
        followHalal: formData.followHalal,
        followVegan: formData.followVegan,
        followVegetarian: formData.followVegetarian,
      },
    };

    // Dispatch the registration action
    setIsLoading(true); // Consider using a loading state to improve UX
    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        // Handle successful registration
        setIsLoading(false);
        toast.success("Account created successfully");
        navigate("/");
      })
      .catch((error) => {
        // Handle errors
        setIsLoading(false);
        toast.error(
          error.message || "Failed to create an account. Please try again."
        );
      });
  };

  const handleSkip = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data for registration
    const userData = {
      email: formData.email,
      password: formData.password,
      additionalData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        postCode: formData.postCode,
        city: formData.city,
        country: formData.country,
        hasDiabetes: false,
        hasHeartDisease: false,
        hasHypertension: false,
        hasCeliacDisease: false,
        isAllergic: false,
        diabetesType: "",
        followGlutanFree: false,
        followDairyFree: false,
        followKeto: false,
        followPaleo: false,
        followMediterranean: false,
        followHalal: false,
        followVegan: false,
        followVegetarian: false,
      },
    };

    // Dispatch the registration action
    setIsLoading(true); // Consider using a loading state to improve UX
    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        // Handle successful registration
        setIsLoading(false);
        toast.success("Account created successfully");
        navigate("/");
      })
      .catch((error) => {
        // Handle errors
        setIsLoading(false);
        toast.error(
          error.message || "Failed to create an account. Please try again."
        );
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className={`${styles.auth_container}`}>
        <Breadcrumb items={[{ label: "Sign up", path: "/register" }]} />
        <div
          className={`${styles.auth_content} w-100 d-flex justify-content-center align-items-center flex-column`}
        >
          <div className={`${styles.auth_header} d-flex`}>
            <h4>Create an account</h4>
            <h6>
              Already a customer?
              <span>
                <Link to="/login">Sign in</Link>
              </span>
            </h6>
          </div>
          <div className={`${styles.steps_indicator}`}>
            <div
              className={`${
                currentStep === 1
                  ? styles.step + " " + styles.active
                  : styles.step + " " + styles.active
              }`}
            >
              <span>{currentStep === 1 ? "1" : "✔"}</span>
            </div>
            <div
              className={`${styles.steps_line} ${
                currentStep > 1 ? styles.steps_line_active : ""
              }`}
            ></div>
            <div
              className={`${
                currentStep === 2
                  ? styles.step + " " + styles.active
                  : styles.step
              }`}
            >
              <span>2</span>
            </div>
          </div>
          {currentStep === 2 && (
            <p className={styles.go_previous_step} onClick={goPreviousStep}>
              Previous step
            </p>
          )}
          {currentStep === 1 && (
            <Card cardClass={styles.auth_card}>
              <div
                className={`${styles.auth_form_container} w-100 d-flex justify-content-center align-items-center flex-column`}
              >
                <form className={`${styles.auth_form}`}>
                  <h4>Account Details</h4>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`${styles.normal_input}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="password">Set Password</label>
                  <div className={`${styles.input_password} d-flex`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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

                  <div className={`${styles.line_separator}`} />

                  <h4>Personal Details</h4>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`${styles.normal_input}`}
                    defaultValue="Will"
                    required
                  />

                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className={`${styles.normal_input}`}
                    defaultValue="Smith"
                    name="lastName"
                    required
                  />

                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className={`${styles.normal_input}`}
                    defaultValue="07712318912"
                    name="phone"
                    required
                  />

                  <label htmlFor="address">Address Line</label>
                  <input
                    type="text"
                    id="address"
                    className={`${styles.normal_input}`}
                    defaultValue="123 Main St"
                    name="address"
                    required
                  />

                  <label htmlFor="postCode">Post Code</label>
                  <input
                    type="text"
                    id="postCode"
                    className={`${styles.normal_input}`}
                    defaultValue="W12 1RT"
                    name="postCode"
                    required
                  />

                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    className={`${styles.normal_input}`}
                    defaultValue="London"
                    name="city"
                    required
                  />

                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    className={`${styles.normal_input}`}
                    defaultValue="United Kingdom"
                    name="country"
                    required
                  />

                  <button
                    type="button"
                    onClick={goToNextStep}
                    className={`btn-1`}
                  >
                    Go to next step
                  </button>
                </form>
              </div>
            </Card>
          )}
          {currentStep === 2 && (
            <Card cardClass={styles.auth_card}>
              <div
                className={`${styles.auth_form_container} w-100 d-flex justify-content-center align-items-center flex-column`}
              >
                <p className={styles.skip} onClick={handleSkip}>
                  Skip this
                </p>
                <form
                  onSubmit={handleRegistration}
                  className={`${styles.auth_form}`}
                >
                  <h4>Health Information</h4>
                  <p style={{ color: "#808080" }}>
                    We use this information to tailor your shopping experience
                    with personalized product suggestions based on your health
                    needs.
                  </p>

                  <div className={`${styles.health_problems_container}`}>
                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="hasDiabetes"
                          name="hasDiabetes"
                          checked={formData.hasDiabetes}
                          onChange={handleChange}
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
                        I have diabetes
                      </Label>
                    </div>

                    {/* Additional health issues checkboxes */}
                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="hasHeartDisease"
                          name="hasHeartDisease"
                          checked={formData.hasHeartDisease}
                          onChange={handleChange}
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
                        I have heart disease
                      </Label>
                    </div>

                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="hasHypertension"
                          name="hasHypertension"
                          checked={formData.hasHypertension}
                          onChange={handleChange}
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
                        I have hypertension
                      </Label>
                    </div>

                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="hasCeliacDisease"
                          name="hasCeliacDisease"
                          checked={formData.hasCeliacDisease}
                          onChange={handleChange}
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
                        I have celiac disease
                      </Label>
                    </div>
                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="isAllergic"
                          name="isAllergic"
                          checked={formData.isAllergic}
                          onChange={handleChange}
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
                        I am allergic to something
                      </Label>
                    </div>
                  </div>
                  {formData.hasDiabetes && (
                    <>
                      <div className={`${styles.line_separator}`} />
                      <label htmlFor="diabetesType">Type of Diabetes</label>
                      <select
                        name="diabetesType"
                        id="diabetesType"
                        value={formData.diabetesType}
                        onChange={handleChange}
                        className={`${styles.selectMenu}`}
                      >
                        <option value="">Select Type</option>
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                      </select>
                    </>
                  )}

                  <div className={`${styles.line_separator}`} />

                  <label
                    htmlFor="diabetesType"
                    style={{ marginBottom: "1.5rem" }}
                  >
                    Do you follow any specific diet?
                  </label>

                  <div className={`${styles.health_problems_container}`}>
                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="followGlutanFree"
                          name="followGlutanFree"
                          checked={formData.followGlutanFree}
                          onChange={handleChange}
                          sx={{
                            border: "1px solid #808080",
                            width: "25px",
                            height: "25px",
                            "&:active": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                            },
                            "&:focus": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                            "&:focus-visible": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                          }}
                        />{" "}
                        Gluten-free
                      </Label>
                    </div>
                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="followDairyFree"
                          name="followDairyFree"
                          checked={formData.followDairyFree}
                          onChange={handleChange}
                          sx={{
                            border: "1px solid #808080",
                            width: "25px",
                            height: "25px",
                            "&:active": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                            },
                            "&:focus": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                            "&:focus-visible": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                          }}
                        />{" "}
                        Dairy-free
                      </Label>
                    </div>

                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="followVegan"
                          name="followVegan"
                          checked={formData.followVegan}
                          onChange={handleChange}
                          sx={{
                            border: "1px solid #808080",
                            width: "25px",
                            height: "25px",
                            "&:active": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                            },
                            "&:focus": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                            "&:focus-visible": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                          }}
                        />{" "}
                        Vegan
                      </Label>
                    </div>

                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="followVegetarian"
                          name="followVegetarian"
                          checked={formData.followVegetarian}
                          onChange={handleChange}
                          sx={{
                            border: "1px solid #808080",
                            width: "25px",
                            height: "25px",
                            "&:active": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                            },
                            "&:focus": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                            "&:focus-visible": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                          }}
                        />{" "}
                        Vegetarian
                      </Label>
                    </div>

                    <div className={`${styles.health_problem}`}>
                      <Label
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Checkbox
                          defaultChecked={false}
                          id="followHalal"
                          name="followHalal"
                          checked={formData.followHalal}
                          onChange={handleChange}
                          sx={{
                            border: "1px solid #808080",
                            width: "25px",
                            height: "25px",
                            "&:active": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
                            },
                            "&:focus": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                            "&:focus-visible": {
                              outline: "none",
                              boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                            },
                          }}
                        />{" "}
                        Halal
                      </Label>
                    </div>
                  </div>

                  <button
                    className={`btn-1`}
                    style={{ marginTop: "1.5rem" }}
                    type="submit"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            </Card>
          )}
        </div>
      </section>
    </>
  );
};

export default Register;
