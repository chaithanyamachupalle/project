import React, { useState } from "react";
import axios from "axios"; // Import axios for making API requests
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert,
} from "mdb-react-ui-kit";

const Forget = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // To store and display error messages

  // Handle form input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Show error messages for 3 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  // Send request to backend to update password
  const sendRequest = async () => {
    try {
      const res = await axios.post("YOUR_BACKEND_API_ENDPOINT", {
        email: inputs.email,
        password: inputs.password,
      });
      const data = await res.data;
      return data;
    } catch (err) {
      console.error(err);
      showError("Something went wrong. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!inputs.email || !inputs.password || !inputs.confirmPassword) {
      showError("All fields are required.");
      return;
    }

    if (!isValidEmail(inputs.email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (inputs.password.length < 6) {
      showError("Password must be at least 6 characters long.");
      return;
    }

    if (inputs.password !== inputs.confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    // If all validations pass
    const data = await sendRequest();
    if (data) {
      showError("Password updated successfully!");
    }
  };

  return (
    <MDBContainer className="mt-5 d-flex justify-content-center">
      <MDBCard style={{ maxWidth: "500px", width: "100%" }}>
        <MDBCardBody>
          <h3 className="text-center mb-4">Update Password</h3>

          {/* Error message display */}
          {error && (
            <MDBAlert color="danger" className="text-center">
              {error}
            </MDBAlert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label>Email address</label>
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
                placeholder="Enter your new password"
                style={{ backgroundColor: "#f0f8ff" }} // Light background
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <label>Confirm Password</label>
              <MDBInput
                onChange={handleChange}
                id="confirmPassword"
                type="password"
                value={inputs.confirmPassword}
                className="form-control"
                placeholder="Confirm your new password"
                style={{ backgroundColor: "#f0f8ff" }} // Light background
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <MDBBtn color="primary" type="submit" block>
                Update Password
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Forget;
