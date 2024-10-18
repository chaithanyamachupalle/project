import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBAlert,
} from "mdb-react-ui-kit";
import config from "../config"; // Ensure to import your config

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const res = await axios.get(`${config.BASE_URL}/api/users/${userId}`);
        setUserDetails(res.data.user);
      } catch (err) {
        setError("Failed to fetch user details.");
        console.error(err);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUserDetails((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      await axios.put(`${config.BASE_URL}/api/users/${userId}`, userDetails);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/home"); // Navigate to home after 3 seconds
      }, 3000);
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardBody>
          <h3 className="text-center mb-4">Update Profile</h3>

          {/* Show error message */}
          {error && (
            <MDBAlert color="danger" className="text-center">
              {error}
            </MDBAlert>
          )}

          {/* Show success message */}
          {successMessage && (
            <MDBAlert color="success" className="text-center">
              {successMessage}
            </MDBAlert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <MDBInput
                onChange={handleChange}
                id="username"
                label="Username"
                type="text"
                className="form-control"
                value={userDetails.username}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="mb-4">
              <MDBInput
                onChange={handleChange}
                id="email"
                label="Email"
                type="email"
                className="form-control"
                value={userDetails.email}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="mb-4">
              <MDBInput
                onChange={handleChange}
                id="phoneNumber"
                label="Phone Number"
                type="text" // Use text to accommodate different formats
                className="form-control"
                value={userDetails.phoneNumber}
                style={{ backgroundColor: "#f0f8ff" }}
              />
            </div>

            <div className="text-center">
              <MDBBtn type="submit" color="primary">
                Update Profile
              </MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Profile;
