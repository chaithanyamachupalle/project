import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
import ReCAPTCHA from "react-google-recaptcha";
import config from "../config";
import {
  MDBContainer,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBAlert,
} from "mdb-react-ui-kit";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management for form inputs, captcha validation, and error messages
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "", // This will only be used for validation
  });

  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState(""); // To store and display error messages

  // Handle form field changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle captcha validation
  const onCaptchaChange = (value) => {
    setCaptchaValid(!!value); // Ensures it's valid only when a value exists
  };

  // Simple validation function for email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation for phone number format (10 digits)
  const isValidPhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  // Show error messages for 3 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000); // Hide error after 3 seconds
  };

  // Send request to the backend API for signup
  const sendRequest = async (type = "signup") => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/users/${type}`, {
        username: inputs.username,
        email: inputs.email,
        phoneNumber: inputs.phoneNumber,
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
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.confirmPassword) {
      showError("All fields are required.");
      return;
    }

    if (!isValidEmail(inputs.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!isValidPhoneNumber(inputs.phoneNumber)) {
      showError("Phone number must be 10 digits.");
      return;
    }

    if (inputs.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (inputs.password !== inputs.confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    if (!captchaValid) {
      showError("Please complete the captcha.");
      return;
    }

    // If all validations pass
    const data = await sendRequest();
    if (data) {
      localStorage.setItem("userId", data.user._id);
      dispatch(authActions.login());
      navigate("/welcome"); // Navigate to the welcome page after signup
    }
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center mb-4">Sign Up</h3>

          {/* Error message display */}
          {error && (
            <MDBAlert color="danger" className="text-center">
              {error}
            </MDBAlert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>Username</label>
              <MDBInput
                onChange={handleChange}
                id="username"
                type="text"
                className="form-control"
                value={inputs.username}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="mb-4">
              <label>Email</label>
              <MDBInput
                onChange={handleChange}
                id="email"
                type="email"
                className="form-control"
                value={inputs.email}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="mb-4">
              <label>Phone Number</label>
              <MDBInput
                onChange={handleChange}
                id="phoneNumber"
                type="text" // Set type to text to handle phone number validation
                className="form-control"
                value={inputs.phoneNumber}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="mb-4">
              <label>Password</label>
              <MDBInput
                onChange={handleChange}
                id="password"
                type="password"
                className="form-control"
                value={inputs.password}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="mb-4">
              <label>Confirm Password</label>
              <MDBInput
                onChange={handleChange}
                id="confirmPassword"
                type="password"
                className="form-control"
                value={inputs.confirmPassword}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            {/* reCAPTCHA integration */}
            <div className="mb-4">
              <ReCAPTCHA
                sitekey="YOUR_GOOGLE_RECAPTCHA_SITE_KEY" // Replace with your actual site key
                onChange={onCaptchaChange}
              />
            </div>

            <div className="text-center">
              <MDBBtn type="submit" color="primary" disabled={!captchaValid}>
                Sign Up
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Signup;
