import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA
import config from "../config";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert,
} from "mdb-react-ui-kit";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [captchaValid, setCaptchaValid] = useState(false); // Captcha state
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input field changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // reCAPTCHA validation handler
  const onCaptchaChange = (value) => {
    setCaptchaValid(!!value); // Ensures captcha is valid only when a value exists
  };

  // Simple email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Display error message for 3 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000); // Clear error after 3 seconds
  };

  // Send request to backend for login
  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/users/${type}`, {
        email: inputs.email,
        password: inputs.password,
      });
      const data = await res.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!inputs.email || !inputs.password) {
      showError("All fields are required.");
      return;
    }

    if (!isValidEmail(inputs.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (inputs.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (!captchaValid) {
      showError("Please complete the captcha.");
      return;
    }

    // Send login request if all validations pass
    const data = await sendRequest();
    if (data) {
      localStorage.setItem("userId", data.user._id);
      dispatch(authActions.login());
      navigate("/header"); // Navigate to the header page after login
    }
  };

  return (
    <MDBContainer className="mt-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: "500px", width: "100%" }}>
        <MDBCardBody>
          <h3 className="text-center mb-4">Login</h3>

          {/* Error message display */}
          {error && (
            <MDBAlert color="danger" className="text-center">
              {error}
            </MDBAlert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label>Email</label>
              <MDBInput
                onChange={handleChange}
                id="email"
                type="email"
                value={inputs.email}
                className="form-control"
                placeholder="Enter your email"
                style={{ backgroundColor: "#f0f8ff" }} // Light background
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label>Password</label>
              <MDBInput
                onChange={handleChange}
                id="password"
                type="password"
                value={inputs.password}
                className="form-control"
                placeholder="Enter your password"
                style={{ backgroundColor: "#f0f8ff" }} // Light background
              />
            </div>

            {/* reCAPTCHA */}
            <div className="mb-4">
              <ReCAPTCHA
                sitekey="YOUR_GOOGLE_RECAPTCHA_SITE_KEY" // Replace with your actual site key
                onChange={onCaptchaChange}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <MDBBtn
                type="submit"
                color="primary"
                block
                disabled={!captchaValid} // Disable button if captcha is not completed
              >
                Login
              </MDBBtn>
            </div>
          </form>

          {/* Additional Links */}
          <div className="text-center mt-3">
            <a href="/forget">Forgot password?</a> <br />
            Not a member? <a href="/signup">Register</a>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
